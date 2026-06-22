import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { styles } from './styles';

type FarmaciaScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Farmacia'>;

interface Props {
  navigation: FarmaciaScreenNavigationProp;
}

export default function TelaFarmacia({ navigation }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [forma, setForma] = useState('');
  const [estoque, setEstoque] = useState('');

  const medicamentos = useStore((state) => state.medicamentos);
  const addMedicamento = useStore((state) => state.addMedicamento);

  const handleSave = () => {
    if (!nome || !dosagem) {
      Alert.alert('Erro', 'Nome e dosagem sÃ£o obrigatÃ³rios.');
      return;
    }

    if (nome.toLowerCase().includes('aspirina') || nome.toLowerCase() === 'aas') {
      Alert.alert('AtenÃ§Ã£o: InteraÃ§Ã£o', 'Cuidado ao misturar com anticoagulantes!');
    }

    addMedicamento({ nome, dosagem, forma, estoque });
    setIsAdding(false);
    setNome(''); setDosagem(''); setForma(''); setEstoque('');
  };

  const handleGeneratePDF = async () => {
    if (medicamentos.length === 0) {
      Alert.alert('AtenÃ§Ã£o', 'VocÃª nÃ£o possui medicamentos cadastrados para gerar o relatÃ³rio.');
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
          <h1>RelatÃ³rio de Medicamentos (FarmÃ¡cia)</h1>
          <p>Confira abaixo a lista atualizada de medicamentos em estoque do paciente:</p>
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
        Alert.alert('Aviso', 'O compartilhamento nÃ£o estÃ¡ disponÃ­vel neste dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'NÃ£o foi possÃ­vel gerar o PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isAdding ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Novo Medicamento</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome (Ex: Losartana)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} value={nome} onChangeText={setNome} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dosagem (Ex: 50mg)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} value={dosagem} onChangeText={setDosagem} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Forma (Ex: Comprimido, Xarope)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} value={forma} onChangeText={setForma} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantidade em Estoque</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} value={estoque} onChangeText={setEstoque} keyboardType="numeric" />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>FarmÃ¡cia</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity style={styles.pdfButton} onPress={handleGeneratePDF}>
                <Text style={styles.addButtonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
                <Text style={styles.addButtonText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={medicamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardSub}>{item.dosagem} - {item.forma}</Text>
                </View>
                <View style={styles.estoqueBadge}>
                  <Text style={styles.estoqueText}>Estoque: {item.estoque}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum medicamento cadastrado.</Text>}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}


