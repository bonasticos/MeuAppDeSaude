import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert, Modal, TextInput } from 'react-native';
import { useStore } from '../../store/useStore';
import { Lembrete } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
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
  const lembretesData = useStore((state) => state.lembretes);
  const addLembrete = useStore((state) => state.addLembrete);
  const removeLembrete = useStore((state) => state.removeLembrete);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('SaÃƒÂºde');
  
  const categories = [
    { name: 'SaÃƒÂºde', color: '#17a2b8' },
    { name: 'RemÃƒÂ©dio', color: '#dc3545' },
    { name: 'ExercÃƒÂ­cio', color: '#28a745' },
    { name: 'Higiene', color: '#0056b3' }
  ];

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'As notificaÃƒÂ§ÃƒÂµes estÃƒÂ£o desativadas. VocÃƒÂª nÃƒÂ£o receberÃƒÂ¡ alertas dos seus lembretes.');
      }
    }
    requestPermissions();
  }, []);

  const handleSaveNovo = async () => {
    if (!title || !time) {
      Alert.alert('AtenÃƒÂ§ÃƒÂ£o', 'Preencha o tÃƒÂ­tulo e o horÃƒÂ¡rio.');
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      Alert.alert('Erro', 'Formato de hora invÃƒÂ¡lido. Use HH:MM (ex: 14:30).');
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
          body: "EstÃƒÂ¡ na hora do seu lembrete: " + novoLembrete.type,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hour,
          minute: minute,
        },
      });
      Alert.alert('Sucesso', `Lembrete agendado para tocar todos os dias ÃƒÂ s ${time}.`);
    } catch (e) {
      console.log('Notification error:', e);
      Alert.alert('Aviso', 'Lembrete salvo, mas as notificaÃƒÂ§ÃƒÂµes nativas podem nÃƒÂ£o funcionar na Web.');
    }

    setModalVisible(false);
    setTitle('');
    setTime('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Apagar', 'Deseja excluir este lembrete?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => removeLembrete(id) }
    ]);
  };

  const renderItem = ({ item }: { item: Lembrete }) => (
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
          <Text style={styles.deleteButtonText}>Ã¢Å“â€¢</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Lembretes</Text>
      </View>

      <TouchableOpacity style={styles.newButton} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
        <Text style={styles.newButtonText}>+ Novo Lembrete</Text>
      </TouchableOpacity>

      <FlatList
        data={lembretesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>VocÃƒÂª ainda nÃƒÂ£o possui lembretes.</Text>}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Lembrete</Text>
            
            <Text style={styles.label}>TÃƒÂ­tulo</Text>
            <TextInput placeholderTextColor="#999" 
              style={styles.input} 
              placeholder="Ex: Tomar Losartana" 
              value={title} 
              onChangeText={setTitle} 
            />

            <Text style={styles.label}>HorÃƒÂ¡rio (HH:MM)</Text>
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
    </SafeAreaView>
  );
}


