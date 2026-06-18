import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useEstadoGlobal } from '../../armazenamento/estadoGlobal';
import { styles } from './styles';

type EducacaoFisicaNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EducacaoFisica'>;

interface Props {
  navigation: EducacaoFisicaNavigationProp;
}

export default function TelaEducacaoFisica({ navigation }: Props) {
  const [desc, setDesc] = useState('');
  const treinos = useEstadoGlobal((state) => state.treinos);
  const addTreino = useEstadoGlobal((state) => state.addTreino);

  const handleRegistrar = () => {
    if (!desc) {
      Alert.alert('Erro', 'Por favor, descreva o treino que você realizou.');
      return;
    }
    addTreino({ descricao: desc });
    Alert.alert('Sucesso', 'Treino registrado! Continue assim!');
    setDesc('');
  };

  const treinosNaSemana = treinos.length % 6; // Lógica mock para exibir na progress bar

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Educação Física</Text>
        <Text style={styles.subtitle}>Acompanhe seus treinos e gasto calórico.</Text>

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
          <Text style={styles.historyTitle}>Últimos Treinos</Text>
          {treinos.length === 0 ? (
            <Text style={{color: '#666'}}>Você ainda não registrou treinos.</Text>
          ) : (
            treinos.map((t) => (
              <Text key={t.id} style={{color: '#333', marginBottom: 4}}>
                {new Date(t.data).toLocaleDateString()}: {t.descricao}
              </Text>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.actionButtonSecondary}>
          <Text style={styles.actionButtonTextSecondary}>Biblioteca de Exercícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
