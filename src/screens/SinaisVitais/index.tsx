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

const BASIC_MOODS = ['Bem', 'Neutro', 'Mal'];

export default function TelaSinaisVitais({ navigation }: Props) {
  const [bpm, setBpm] = useState('');
  const [glucose, setGlucose] = useState('');
  const [pressao, setPressao] = useState('');
  const [oxigenacao, setOxigenacao] = useState('');
  const [humor, setHumor] = useState<string | null>(null);
  const [exercicio, setExercicio] = useState<boolean | null>(null);
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const addSinalVital = useStore((state) => state.addSinalVital);
  const historico = useStore((state) => state.sinaisVitais);

  const handlePressaoChange = (text: string) => {
    let cleaned = text.replace(/[^\d/]/g, '');
    const parts = cleaned.split('/');
    if (parts.length > 2) {
      cleaned = parts[0] + '/' + parts.slice(1).join('');
    }
    setPressao(cleaned);
  };

  const isFormValid = bpm.length > 0 && glucose.length > 0 && pressao.length > 0 && oxigenacao.length > 0 && humor !== null && exercicio !== null;

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Ops!', 'Por favor, preencha todos os campos antes de salvar.');
      return;
    }
    
    if (pressao.indexOf('/') === -1 || pressao.length < 4) {
      Alert.alert('Formato Inválido', 'A pressão arterial deve estar no formato esperado (ex: 120/80).');
      return;
    }

    addSinalVital({ 
      bpm, 
      glicose: glucose, 
      pressao,
      oxigenacao,
      humor,
      exercicio
    });
    
    Alert.alert('Excelente!', 'Seus sinais vitais foram registrados com sucesso. 🩺');
    setBpm('');
    setGlucose('');
    setPressao('');
    setOxigenacao('');
    setHumor(null);
    setExercicio(null);
    setFocusedInput(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sinais Vitais (Enfermagem)</Text>
          <Text style={styles.subtitle}>Acompanhe seus indicadores físicos e de enfermagem para controle diário</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Text>❤️</Text>
              </View>
              <Text style={styles.label}>Batimentos Cardíacos</Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'bpm' && styles.inputFocused]}
              placeholder="Ex: 75 bpm"
              keyboardType="numeric"
              value={bpm}
              onChangeText={setBpm}
              onFocus={() => setFocusedInput('bpm')}
              onBlur={() => setFocusedInput(null)}
              maxLength={3}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Text>🩸</Text>
              </View>
              <Text style={styles.label}>Glicemia (mg/dL)</Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'glucose' && styles.inputFocused]}
              placeholder="Ex: 90 mg/dL"
              keyboardType="numeric"
              value={glucose}
              onChangeText={setGlucose}
              onFocus={() => setFocusedInput('glucose')}
              onBlur={() => setFocusedInput(null)}
              maxLength={4}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Text>🩺</Text>
              </View>
              <Text style={styles.label}>Pressão Arterial</Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'pressao' && styles.inputFocused]}
              placeholder="Ex: 120/80"
              keyboardType="default"
              value={pressao}
              onChangeText={handlePressaoChange}
              onFocus={() => setFocusedInput('pressao')}
              onBlur={() => setFocusedInput(null)}
              maxLength={7}
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                <Text>🫁</Text>
              </View>
              <Text style={styles.label}>Saturação de Oxigênio (%)</Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'oxigenacao' && styles.inputFocused]}
              placeholder="Ex: 98%"
              keyboardType="numeric"
              value={oxigenacao}
              onChangeText={setOxigenacao}
              onFocus={() => setFocusedInput('oxigenacao')}
              onBlur={() => setFocusedInput(null)}
              maxLength={3}
            />
          </View>

          <Text style={styles.sectionTitle}>Como você se sente hoje?</Text>
          <View style={styles.chipContainer}>
            {BASIC_MOODS.map((m) => (
              <TouchableOpacity 
                key={m} 
                style={[styles.chip, humor === m && styles.chipSelected]}
                onPress={() => setHumor(m)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, humor === m && styles.chipTextSelected]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Fez exercício hoje?</Text>
          <View style={styles.exerciseContainer}>
            <TouchableOpacity 
              style={[styles.exerciseBtn, exercicio === true && styles.exerciseBtnSelectedYes]}
              onPress={() => setExercicio(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.exerciseBtnText, exercicio === true && styles.exerciseBtnTextSelectedYes]}>
                Sim, treinei
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exerciseBtn, exercicio === false && styles.exerciseBtnSelectedNo]}
              onPress={() => setExercicio(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.exerciseBtnText, exercicio === false && styles.exerciseBtnTextSelectedNo]}>
                Ainda não
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveButtonText, !isFormValid && { color: '#A0A0AB' }]}>
            Registrar Sinais Vitais
          </Text>
        </TouchableOpacity>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Últimos Registros</Text>
          
          {historico.length === 0 ? (
            <Text style={styles.emptyHistory}>Você ainda não tem registros.</Text>
          ) : (
            historico.slice().reverse().slice(0, 5).map((h) => {
              const dateObj = new Date(h.data);
              return (
                <View key={h.id} style={styles.historyCard}>
                  <View style={styles.historyDateContainer}>
                    <Text style={styles.historyTime}>
                      {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.historyDate}>
                      {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </Text>
                  </View>
                  
                  <View style={styles.historyContent}>
                    <View style={styles.historyRow}>
                      <Text>❤️</Text>
                      <Text style={styles.historyValue}>{h.bpm} bpm</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text>🩸</Text>
                      <Text style={styles.historyValue}>{h.glicose} mg/dL</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text>🩺</Text>
                      <Text style={styles.historyValue}>{h.pressao} mmHg</Text>
                    </View>
                    {h.oxigenacao && (
                      <View style={styles.historyRow}>
                        <Text>🫁</Text>
                        <Text style={styles.historyValue}>{h.oxigenacao}% SpO2</Text>
                      </View>
                    )}
                    {(h.humor || h.exercicio !== undefined) && (
                      <View style={[styles.historyRow, { marginTop: 4, flexWrap: 'wrap' }]}>
                        {h.humor && <Text style={{fontSize: 13, color: '#666', marginRight: 8}}>Humor: {h.humor}</Text>}
                        {h.exercicio !== undefined && <Text style={{fontSize: 13, color: '#666'}}>Exercício: {h.exercicio ? 'Sim' : 'Não'}</Text>}
                      </View>
                    )}
                  </View>
                </View>
              )
            })
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
