import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useStore } from '../../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

type VitalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SinaisVitais'>;

interface Props {
  navigation: VitalsScreenNavigationProp;
}

export default function TelaSinaisVitais({ navigation }: Props) {
  const [bpm, setBpm] = useState('');
  const [glucose, setGlucose] = useState('');
  const [pressao, setPressao] = useState('');
  const addSinalVital = useStore((state) => state.addSinalVital);
  const historico = useStore((state) => state.sinaisVitais);

  const handleSave = () => {
    if (!bpm || !glucose || !pressao) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    addSinalVital({ bpm, glicose: glucose, pressao });
    Alert.alert('Salvo', 'Sinais vitais registrados com sucesso!');
    setBpm('');
    setGlucose('');
    setPressao('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Sinais Vitais</Text>
          <Text style={styles.subtitle}>Registre seus batimentos, pressÃ£o arterial e nÃ­veis de glicose recentes.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Batimentos por Minuto (BPM)</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Ex: 75"
            keyboardType="numeric"
            value={bpm}
            onChangeText={setBpm}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Glicose (mg/dL)</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Ex: 90"
            keyboardType="numeric"
            value={glucose}
            onChangeText={setGlucose}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>PressÃ£o Arterial (mmHg)</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Ex: 120/80"
            keyboardType="default"
            value={pressao}
            onChangeText={setPressao}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Dados</Text>
          </TouchableOpacity>

          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>HistÃ³rico Recente</Text>
            {historico.length === 0 ? (
              <Text style={{color: '#666'}}>Nenhum registro ainda.</Text>
            ) : (
              historico.map((h, index) => (
                <Text key={h.id} style={{color: '#333', marginBottom: 4}}>
                  {new Date(h.data).toLocaleTimeString()}: BPM {h.bpm} | Glicose {h.glicose} | PressÃ£o {h.pressao || '--'}
                </Text>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


