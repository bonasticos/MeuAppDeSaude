import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type EducacaoFisicaNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EducacaoFisica'>;

interface Props {
  navigation: EducacaoFisicaNavigationProp;
}

export default function TelaEducacaoFisica({ navigation }: Props) {
  const [desc, setDesc] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { perfil, updatePerfil } = useStore();
  const frequenciaAtividade = perfil?.frequenciaAtividade || null;
  const treinos = useStore((state) => state.treinos);
  const addTreino = useStore((state) => state.addTreino);

  const activities = [
    'Ativo (Pratico ExercÃ­cios)',
    'De Vez em Quando',
    'NÃ£o Pratico'
  ];

  const biblioteca = [
    { nome: 'Caminhada RÃ¡pida', desc: 'Caminhe em um ritmo acelerado por 30 minutos. Ã“timo para a saÃºde do coraÃ§Ã£o e perda de calorias.' },
    { nome: 'Alongamento Matinal', desc: 'Estique os braÃ§os, pernas e costas logo apÃ³s acordar. Melhora a flexibilidade e postura diÃ¡ria.' },
    { nome: 'Agachamento Simples', desc: 'FaÃ§a 3 sÃ©ries de 12 repetiÃ§Ãµes. Mantenha as costas retas e o peso nos calcanhares.' },
    { nome: 'FlexÃ£o de BraÃ§os', desc: 'Apoie os joelhos no chÃ£o se for iniciante. Tente fazer 3 sÃ©ries do mÃ¡ximo que conseguir.' },
  ];

  const handleRegistrar = () => {
    if (!desc) {
      Alert.alert('Erro', 'Por favor, descreva o treino que vocÃª realizou.');
      return;
    }
    addTreino({ descricao: desc });
    Alert.alert('Sucesso', 'Treino registrado! Continue assim!');
    setDesc('');
  };

  const treinosNaSemana = treinos.length % 6; // LÃ³gica mock para exibir na progress bar

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>EducaÃ§Ã£o FÃ­sica</Text>
        <Text style={styles.subtitle}>Acompanhe seus treinos e gasto calÃ³rico.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PrÃ¡tica de ExercÃ­cios FÃ­sicos</Text>
          <View style={styles.activityList}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.activityButton,
                  frequenciaAtividade === activity && styles.selectedActivityButton
                ]}
                onPress={() => updatePerfil({ frequenciaAtividade: activity })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.activityText,
                  frequenciaAtividade === activity && styles.selectedActivityText
                ]}>{activity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meta Semanal</Text>
          <Text style={styles.infoText}>{treinosNaSemana} de 5 treinos realizados</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(treinosNaSemana / 5) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Registrar Treino</Text>
          <TextInput placeholderTextColor="#999" 
            style={styles.input} 
            placeholder="Ex: Caminhada 30 min" 
            value={desc} 
            onChangeText={setDesc} 
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleRegistrar}>
            <Text style={styles.actionButtonText}>+ Salvar Treino</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Ãšltimos Treinos</Text>
          {treinos.length === 0 ? (
            <Text style={{color: '#666'}}>VocÃª ainda nÃ£o registrou treinos.</Text>
          ) : (
            treinos.map((t) => (
              <Text key={t.id} style={{color: '#333', marginBottom: 4}}>
                {new Date(t.data).toLocaleDateString()}: {t.descricao}
              </Text>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => setModalVisible(true)}>
          <Text style={styles.actionButtonTextSecondary}>Biblioteca de ExercÃ­cios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Biblioteca de ExercÃ­cios</Text>
            <ScrollView>
              {biblioteca.map((item, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{item.nome}</Text>
                  <Text style={styles.exerciseDesc}>{item.desc}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


