import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useEstadoGlobal } from '../../armazenamento/estadoGlobal';
import { styles } from './styles';

type EnfermagemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Enfermagem'>;

interface Props {
  navigation: EnfermagemScreenNavigationProp;
}

export default function TelaEnfermagem({ navigation }: Props) {
  const [temperatura, setTemperatura] = useState('');
  const [pressao, setPressao] = useState('');
  const [spo2, setSpo2] = useState('');

  const addSinalEnfermagem = useEstadoGlobal((state) => state.addSinalEnfermagem);
  const historico = useEstadoGlobal((state) => state.sinaisEnfermagem);

  const handleSave = () => {
    if (!temperatura || !pressao || !spo2) {
      Alert.alert('Atenção', 'Preencha todos os campos vitais.');
      return;
    }

    const temp = parseFloat(temperatura.replace(',', '.'));
    if (temp > 37.8) {
      Alert.alert('Alerta!', 'Febre detectada. Considere procurar atendimento médico.');
    } else if (temp < 35.0) {
      Alert.alert('Alerta!', 'Hipotermia detectada. Procure aquecimento imediato.');
    } else {
      Alert.alert('Sucesso', 'Sinais vitais de enfermagem salvos com sucesso no histórico!');
    }

    addSinalEnfermagem({ temperatura, pressao, spo2 });
    setTemperatura('');
    setPressao('');
    setSpo2('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Enfermagem</Text>
        <Text style={styles.subtitle}>Registro completo de sinais vitais e curativos.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sinais Vitais Avançados</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Temperatura (°C)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} placeholder="Ex: 36.5" keyboardType="numeric" value={temperatura} onChangeText={setTemperatura} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Pressão Arterial (mmHg)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} placeholder="Ex: 120/80" value={pressao} onChangeText={setPressao} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Saturação de Oxigênio (SpO2 %)</Text>
            <TextInput placeholderTextColor="#999" style={styles.input} placeholder="Ex: 98" keyboardType="numeric" value={spo2} onChangeText={setSpo2} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Dados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico Recente</Text>
          {historico.length === 0 ? (
            <Text style={{color: '#666'}}>Nenhum registro ainda.</Text>
          ) : (
            historico.map((h) => (
              <Text key={h.id} style={{color: '#333', marginBottom: 4}}>
                {new Date(h.data).toLocaleDateString()} - Temp: {h.temperatura}°C | PA: {h.pressao} | SpO2: {h.spo2}%
              </Text>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Abrir Cartão de Vacinas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Registro de Curativos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
