import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { useStore } from '../../store/useStore';
import { Lembrete } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { styles } from './styles';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type RemindersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lembretes'>;

interface Props {
  navigation: RemindersScreenNavigationProp;
}

export default function TelaLembretes({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'lembretes' | 'farmacia'>('lembretes');

  const lembretesData = useStore((state) => state.lembretes);
  const addLembrete = useStore((state) => state.addLembrete);
  const removeLembrete = useStore((state) => state.removeLembrete);

  const medicamentos = useStore((state) => state.medicamentos);
  const addMedicamento = useStore((state) => state.addMedicamento);

  // Lembrete State
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Saúde');
  
  // Farmacia State
  const [medModalVisible, setMedModalVisible] = useState(false);
  const [nomeMed, setNomeMed] = useState('');
  const [dosagemMed, setDosagemMed] = useState('');
  const [formaMed, setFormaMed] = useState('');
  const [estoqueMed, setEstoqueMed] = useState('');

  const categories = [
    { name: 'Saúde', color: '#17a2b8' },
    { name: 'Remédio', color: '#dc3545' },
    { name: 'Exercício', color: '#28a745' },
    { name: 'Higiene', color: '#0056b3' }
  ];

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'As notificações estão desativadas. Você não receberá alertas dos seus lembretes.');
      }
    }
    requestPermissions();
  }, []);

  const handleSaveNovo = async () => {
    if (!title || !time) {
      Alert.alert('Atenção', 'Preencha o título e o horário.');
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      Alert.alert('Erro', 'Formato de hora inválido. Use HH:MM (ex: 14:30).');
      return;
    }

    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    const selectedCategory = categories.find(c => c.name === type) || categories[0];

    const novoLembrete = {
      title,
      type,
      time,
      color: selectedCategory.color
    };
    
    addLembrete(novoLembrete);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete: " + novoLembrete.title,
          body: "Está na hora do seu lembrete: " + novoLembrete.type,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hour,
          minute: minute,
        },
      });
      Alert.alert('Sucesso', `Lembrete agendado para tocar todos os dias às ${time}.`);
    } catch (e) {
      Alert.alert('Aviso', 'Lembrete salvo, mas as notificações nativas podem não funcionar neste ambiente.');
    }

    setModalVisible(false);
    setTitle('');
    setTime('');
  };

  const handleSaveMed = () => {
    if (!nomeMed || !dosagemMed) {
      Alert.alert('Erro', 'Nome e dosagem são obrigatórios.');
      return;
    }

    if (nomeMed.toLowerCase().includes('aspirina') || nomeMed.toLowerCase() === 'aas') {
      Alert.alert('Atenção: Interação', 'Cuidado ao misturar com anticoagulantes!');
    }

    addMedicamento({ nome: nomeMed, dosagem: dosagemMed, forma: formaMed, estoque: estoqueMed });
    setMedModalVisible(false);
    setNomeMed(''); setDosagemMed(''); setFormaMed(''); setEstoqueMed('');
  };

  const handleGeneratePDF = async () => {
    if (medicamentos.length === 0) {
      Alert.alert('Atenção', 'Você não possui medicamentos cadastrados para gerar o relatório.');
      return;
    }

    let rows = medicamentos.map(med => `
      <tr>
        <td>${med.nome}</td>
        <td>${med.dosagem}</td>
        <td>${med.forma}</td>
        <td>${med.estoque}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; }
            h1 { color: #0056b3; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0056b3; color: white; }
          </style>
        </head>
        <body>
          <h1>Relatório de Medicamentos (Farmácia)</h1>
          <p>Confira abaixo a lista atualizada de medicamentos em estoque:</p>
          <table>
            <tr>
              <th>Nome</th>
              <th>Dosagem</th>
              <th>Formato</th>
              <th>Estoque</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Aviso', 'O compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Apagar', 'Deseja excluir este lembrete?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => removeLembrete(id) }
    ]);
  };

  const renderLembrete = ({ item }: { item: Lembrete }) => (
    <View style={styles.reminderCard}>
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />
      <View style={styles.reminderContent}>
        <View style={{flex: 1}}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <Text style={styles.reminderType}>{item.type}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lembretes & Farmácia</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lembretes' && styles.tabActive]} 
          onPress={() => setActiveTab('lembretes')}
        >
          <Text style={[styles.tabText, activeTab === 'lembretes' && styles.tabTextActive]}>Alarmes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'farmacia' && styles.tabActive]} 
          onPress={() => setActiveTab('farmacia')}
        >
          <Text style={[styles.tabText, activeTab === 'farmacia' && styles.tabTextActive]}>Estoque Médico</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'lembretes' ? (
        <>
          <TouchableOpacity style={styles.newButton} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
            <Text style={styles.newButtonText}>+ Novo Lembrete</Text>
          </TouchableOpacity>

          <FlatList
            data={lembretesData}
            keyExtractor={(item) => item.id}
            renderItem={renderLembrete}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.empty}>Você ainda não possui lembretes.</Text>}
          />
        </>
      ) : (
        <>
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.pdfButton} activeOpacity={0.8} onPress={handleGeneratePDF}>
              <Text style={styles.newButtonText}>Gerar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addMedButton} activeOpacity={0.8} onPress={() => setMedModalVisible(true)}>
              <Text style={styles.newButtonText}>+ Medicamento</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={medicamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.medCard}>
                <View>
                  <Text style={styles.medTitle}>{item.nome}</Text>
                  <Text style={styles.medSub}>{item.dosagem} - {item.forma}</Text>
                </View>
                <View style={styles.medEstoqueBadge}>
                  <Text style={styles.medEstoqueText}>Qtd: {item.estoque}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum medicamento em estoque.</Text>}
          />
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      {/* Modal Novo Lembrete */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Lembrete</Text>
            
            <Text style={styles.label}>Título</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: Tomar Losartana" 
              value={title} 
              onChangeText={setTitle} 
            />

            <Text style={styles.label}>Horário (HH:MM)</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: 08:30" 
              value={time} 
              onChangeText={setTime} 
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryContainer}>
              {categories.map(c => (
                <TouchableOpacity 
                  key={c.name} 
                  style={[styles.categoryBtn, type === c.name && {borderColor: c.color, backgroundColor: c.color + '20'}]}
                  onPress={() => setType(c.name)}
                >
                  <Text style={[styles.categoryText, type === c.name && {color: c.color, fontWeight: 'bold'}]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveNovo}>
              <Text style={styles.saveModalText}>Agendar Lembrete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Novo Medicamento */}
      <Modal visible={medModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Medicamento</Text>
            
            <Text style={styles.label}>Nome</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: Losartana" 
              value={nomeMed} 
              onChangeText={setNomeMed} 
            />

            <Text style={styles.label}>Dosagem</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: 50mg" 
              value={dosagemMed} 
              onChangeText={setDosagemMed} 
            />
            
            <Text style={styles.label}>Formato</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: Comprimido" 
              value={formaMed} 
              onChangeText={setFormaMed} 
            />
            
            <Text style={styles.label}>Estoque</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: 30" 
              value={estoqueMed} 
              onChangeText={setEstoqueMed} 
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveMed}>
              <Text style={styles.saveModalText}>Salvar Medicamento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setMedModalVisible(false)}>
              <Text style={styles.cancelModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}


