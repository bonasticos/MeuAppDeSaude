import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

type PsicologiaNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Psicologia'>;

interface Props {
  navigation: PsicologiaNavigationProp;
}

const questoesPHQ9 = [
  "Pouco interesse ou pouco prazer em fazer as coisas?",
  "Se sentiu para baixo, deprimido(a) ou sem perspectiva?",
  "Dificuldade para pegar no sono, ou dormiu demais?",
  "Se sentiu cansado(a) ou com pouca energia?",
  "Falta de apetite ou comendo demais?",
  "Se sentiu mal consigo mesmo(a) ou um fracasso?",
  "Dificuldade de se concentrar?",
  "LentidÃ£o ou agitaÃ§Ã£o fora do normal?",
  "Pensamentos de se machucar ou de morte?"
];

const questoesGAD7 = [
  "Se sentiu nervoso(a), ansioso(a) ou muito tenso(a)?",
  "NÃ£o foi capaz de impedir ou de controlar as preocupaÃ§Ãµes?",
  "Preocupou-se muito com diversas coisas?",
  "Dificuldade para relaxar?",
  "Ficou tÃ£o agitado(a) que foi difÃ­cil ficar parado(a)?",
  "Ficou facilmente aborrecido(a) ou irritado(a)?",
  "Sentiu medo de que algo terrÃ­vel fosse acontecer?"
];

export default function TelaPsicologia({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSOS = () => {
    Alert.alert('Ãrea de Crise', 'Ligue 188 (CVV) ou contate sua emergÃªncia cadastrada.');
  };

  const startQuiz = (type: 'PHQ-9' | 'GAD-7') => {
    setCurrentQuiz(type);
    setQuestions(type === 'PHQ-9' ? questoesPHQ9 : questoesGAD7);
    setAnswers(new Array(type === 'PHQ-9' ? 9 : 7).fill(-1));
    setModalVisible(true);
  };

  const answerQuestion = (index: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = score;
    setAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (answers.includes(-1)) {
      Alert.alert('Aviso', 'Por favor, responda todas as perguntas.');
      return;
    }
    const totalScore = answers.reduce((a, b) => a + b, 0);
    setModalVisible(false);
    Alert.alert(
      `Resultado ${currentQuiz}`,
      `Sua pontuaÃ§Ã£o foi: ${totalScore}\n\nLembre-se: Este aplicativo nÃ£o substitui avaliaÃ§Ã£o mÃ©dica profissional. Consulte seu psicÃ³logo ou psiquiatra.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Psicologia</Text>
        <Text style={styles.subtitle}>Cuide da sua saÃºde mental e bem-estar.</Text>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosButtonText}>SOS / Ãrea de Crise</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>DiÃ¡rio Emocional</Text>
          <Text style={styles.infoText}>O histÃ³rico de humor salvo na tela principal jÃ¡ Ã© compartilhado com a psicologia.</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Humor')}>
            <Text style={styles.actionButtonText}>Abrir DiÃ¡rio de Humor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>QuestionÃ¡rios (Triagem)</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => startQuiz('PHQ-9')}>
            <Text style={styles.secondaryButtonText}>Responder PHQ-9 (DepressÃ£o)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => startQuiz('GAD-7')}>
            <Text style={styles.secondaryButtonText}>Responder GAD-7 (Ansiedade)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{currentQuiz}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{padding: 20}}>
            <Text style={{marginBottom: 20, fontSize: 16, color: '#666'}}>Nas Ãºltimas duas semanas, com que frequÃªncia vocÃª foi incomodado(a) pelos problemas abaixo?</Text>
            {questions.map((q, idx) => (
              <View key={idx} style={styles.questionCard}>
                <Text style={styles.questionText}>{idx + 1}. {q}</Text>
                <View style={styles.optionsRow}>
                  {['Nenhuma', 'VÃ¡rios dias', 'Mais da metade', 'Quase todos'].map((opt, optIdx) => (
                    <TouchableOpacity 
                      key={optIdx} 
                      style={[styles.optionBtn, answers[idx] === optIdx && styles.optionBtnSelected]}
                      onPress={() => answerQuestion(idx, optIdx)}
                    >
                      <Text style={[styles.optionText, answers[idx] === optIdx && styles.optionTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.submitQuizBtn} onPress={submitQuiz}>
              <Text style={styles.submitQuizText}>Finalizar AvaliaÃ§Ã£o</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}


