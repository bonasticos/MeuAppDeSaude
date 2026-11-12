import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, Modal, Platform } from 'react-native';
import { useStore } from '../../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';
import {
  GAD7_PERGUNTAS,
  OPCOES_TRIAGEM,
  PHQ9_PERGUNTAS,
  ResultadoClassificacao,
  TipoQuestionario,
  classificarGAD7,
  classificarPHQ9,
} from './questionarios';

type MoodScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Humor'>;

interface Props {
  navigation: MoodScreenNavigationProp;
}

const MOODS = [
  { id: 'feliz', label: 'Feliz', emoji: '😊', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'triste', label: 'Triste', emoji: '😢', color: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'nervoso', label: 'Nervoso', emoji: '😠', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'ansioso', label: 'Ansioso', emoji: '😰', color: '#8B5CF6', bgColor: '#EDE9FE' },
];

const ACTIVITIES = [
  'Trabalho', 'Família', 'Saúde', 'Sono',
  'Relacionamentos', 'Estudos', 'Lazer', 'Finanças'
];

export default function MoodScreen({ navigation }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Estados dos Questionários PHQ-9 e GAD-7 (RF41)
  const [activeQuiz, setActiveQuiz] = useState<TipoQuestionario | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{
    tipo: TipoQuestionario;
    pontuacao: number;
    maxPontuacao: number;
    detalhes: ResultadoClassificacao;
  } | null>(null);

  const addHumor = useStore((state) => state.addHumor);
  const humorHistorico = useStore((state) => state.humorHistorico);
  const sinaisVitais = useStore((state) => state.sinaisVitais);
  const avaliacoesPsicologia = useStore((state) => state.avaliacoesPsicologia);
  const addAvaliacaoPsicologia = useStore((state) => state.addAvaliacaoPsicologia);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const handleSave = () => {
    if (!selectedMood) {
      mostrarAlerta('Ops!', 'Por favor, selecione como você está se sentindo hoje.');
      return;
    }

    if (!selectedActivity) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const confirmar = window.confirm(
          'Faltou um detalhe\n\nSelecionar o que influenciou seu humor ajuda muito a equipe de psicologia a entender seu padrão de comportamento. Deseja salvar mesmo assim?'
        );
        if (confirmar) {
          addHumor({ moodId: selectedMood, activity: undefined });
          mostrarAlerta('Tudo certo!', 'Seu humor foi registrado com sucesso. 🌟');
          setSelectedMood(null);
          setSelectedActivity(null);
        }
        return;
      }

      Alert.alert(
        'Faltou um detalhe',
        'Selecionar o que influenciou seu humor ajuda muito a equipe de psicologia a entender seu padrão de comportamento. Deseja salvar mesmo assim?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salvar sem atividade',
            onPress: () => {
              addHumor({ moodId: selectedMood, activity: undefined });
              Alert.alert('Tudo certo!', 'Seu humor foi registrado com sucesso. 🌟');
              setSelectedMood(null);
              setSelectedActivity(null);
            }
          }
        ]
      );
      return;
    }

    addHumor({ moodId: selectedMood, activity: selectedActivity });
    mostrarAlerta('Excelente!', 'Registro completo salvo com sucesso. Isso ajuda muito na sua análise comportamental. 🌟');
    setSelectedMood(null);
    setSelectedActivity(null);
  };

  const iniciarQuestionario = (tipo: TipoQuestionario) => {
    const total = tipo === 'PHQ-9' ? PHQ9_PERGUNTAS.length : GAD7_PERGUNTAS.length;
    setActiveQuiz(tipo);
    setStepIndex(0);
    setAnswers(Array(total).fill(-1));
    setQuizResult(null);
  };

  const fecharQuestionario = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setStepIndex(0);
    setAnswers([]);
  };

  const perguntasAtuais = activeQuiz === 'PHQ-9' ? PHQ9_PERGUNTAS : GAD7_PERGUNTAS;
  const respostaAtual = answers[stepIndex] ?? -1;

  const selecionarResposta = (valor: number) => {
    const updated = [...answers];
    updated[stepIndex] = valor;
    setAnswers(updated);

    if (stepIndex < perguntasAtuais.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const finalizarQuestionario = () => {
    if (!activeQuiz) return;
    if (answers.some((a) => a < 0)) {
      mostrarAlerta('Atenção', 'Responda todas as perguntas para calcular o escore.');
      return;
    }

    const total = answers.reduce((acc, v) => acc + v, 0);
    const maxPontuacao = perguntasAtuais.length * 3;
    const detalhes =
      activeQuiz === 'PHQ-9'
        ? classificarPHQ9(total, answers[8] ?? 0)
        : classificarGAD7(total);

    addAvaliacaoPsicologia({
      tipo: activeQuiz,
      pontuacao: total,
      maxPontuacao,
      classificacao: detalhes.classificacao,
      orientacao: detalhes.orientacao,
      alertaCritico: detalhes.alertaCritico,
    });

    setQuizResult({
      tipo: activeQuiz,
      pontuacao: total,
      maxPontuacao,
      detalhes,
    });
  };

  const getMoodConfig = (moodId: string) => {
    return MOODS.find(m => m.id === moodId) || MOODS[0];
  };

  // Merge histories and sort desc
  const mergedHistory = [
    ...(humorHistorico || []).map(h => ({ type: 'humor' as const, data: h.data, item: h })),
    ...(avaliacoesPsicologia || []).map(a => ({ type: 'avaliacao' as const, data: a.data, item: a })),
    ...(sinaisVitais || []).map(s => ({ type: 'sinal' as const, data: s.data, item: s }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Saúde Mental (Psicologia & Humor)</Text>
          <Text style={styles.subtitle}>Acompanhe seu bem-estar psicológico e físico</Text>
        </View>

        <View style={styles.moodGrid}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;

            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodCard,
                  isSelected && {
                    borderColor: mood.color,
                    backgroundColor: '#FFFFFF',
                    shadowColor: mood.color,
                    shadowOpacity: 0.15,
                    elevation: 8,
                    transform: [{ scale: 1.02 }]
                  }
                ]}
                onPress={() => setSelectedMood(mood.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.emojiContainer,
                  isSelected ? { backgroundColor: mood.bgColor } : {}
                ]}>
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                </View>
                <Text style={[
                  styles.moodLabel,
                  isSelected && { color: mood.color, fontWeight: '700' }
                ]}>{mood.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedMood && (
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>O que mais influenciou isso?</Text>
            <View style={styles.activityScroll}>
              {ACTIVITIES.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  style={[
                    styles.activityChip,
                    selectedActivity === activity && styles.activityChipSelected
                  ]}
                  onPress={() => setSelectedActivity(activity)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.activityChipText,
                    selectedActivity === activity && styles.activityChipTextSelected
                  ]}>
                    {activity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, !selectedMood && styles.saveButtonDisabled]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveButtonText, !selectedMood && { color: '#A0A0AB' }]}>
            Salvar Registro Psicológico
          </Text>
        </TouchableOpacity>

        {/* Triagem Clínica: PHQ-9 e GAD-7 (RF41) */}
        <View style={styles.screeningSection}>
          <Text style={styles.sectionTitle}>Questionários de Triagem (RF41)</Text>
          <Text style={styles.screeningSubtitle}>
            Avaliações validadas para acompanhar sinais de depressão e ansiedade com resultado orientativo.
          </Text>

          <View style={styles.screeningRow}>
            <TouchableOpacity
              style={styles.screeningCard}
              onPress={() => iniciarQuestionario('PHQ-9')}
              activeOpacity={0.8}
            >
              <View style={[styles.screeningBadge, { backgroundColor: '#DBEAFE' }]}>
                <Text style={[styles.screeningBadgeText, { color: '#1D4ED8' }]}>9 PERGUNTAS</Text>
              </View>
              <Text style={styles.screeningCardTitle}>Teste PHQ-9</Text>
              <Text style={styles.screeningCardDesc}>Triagem orientativa para sintomas de depressão e humor.</Text>
              <Text style={styles.screeningCardAction}>Iniciar PHQ-9 →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.screeningCard}
              onPress={() => iniciarQuestionario('GAD-7')}
              activeOpacity={0.8}
            >
              <View style={[styles.screeningBadge, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.screeningBadgeText, { color: '#6D28D9' }]}>7 PERGUNTAS</Text>
              </View>
              <Text style={styles.screeningCardTitle}>Teste GAD-7</Text>
              <Text style={styles.screeningCardDesc}>Triagem orientativa para sintomas de ansiedade.</Text>
              <Text style={styles.screeningCardAction}>Iniciar GAD-7 →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Linha do Tempo (Humor, Triagens & Sinais)</Text>

          {mergedHistory.length === 0 ? (
            <Text style={styles.emptyHistory}>Você ainda não possui registros.</Text>
          ) : (
            mergedHistory.slice(0, 10).map((record) => {
              if (record.type === 'humor') {
                const h = record.item;
                const moodConfig = getMoodConfig(h.moodId);
                return (
                  <View key={`humor-${h.id}`} style={styles.historyCard}>
                    <View style={[styles.historyEmojiContainer, { backgroundColor: moodConfig.bgColor }]}>
                      <Text style={styles.historyEmoji}>{moodConfig.emoji}</Text>
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyMoodName}>{moodConfig.label}</Text>
                      <Text style={styles.historyDate}>
                        {new Date(h.data).toLocaleDateString('pt-BR')} às {new Date(h.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {h.activity ? (
                        <Text style={styles.historyActivity}>Influência: {h.activity}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              } else if (record.type === 'avaliacao') {
                const a = record.item;
                return (
                  <View key={`aval-${a.id}`} style={styles.historyCard}>
                    <View style={[styles.historyEmojiContainer, { backgroundColor: '#EDE9FE' }]}>
                      <Text style={styles.historyEmoji}>📋</Text>
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyMoodName}>
                        {a.tipo}: {a.pontuacao}/{a.maxPontuacao} pts — {a.classificacao}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(a.data).toLocaleDateString('pt-BR')} às {new Date(a.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={styles.historyActivity}>{a.orientacao}</Text>
                    </View>
                  </View>
                );
              } else {
                const s = record.item;
                return (
                  <View key={`sinal-${s.id}`} style={styles.historyCard}>
                    <View style={[styles.historyEmojiContainer, { backgroundColor: '#F0F0F5' }]}>
                      <Text style={styles.historyEmoji}>🩺</Text>
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyMoodName}>Sinais Vitais</Text>
                      <Text style={styles.historyDate}>
                        {new Date(s.data).toLocaleDateString('pt-BR')} às {new Date(s.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={styles.historyActivity}>
                        {s.bpm ? `❤️ ${s.bpm} bpm` : ''}
                        {s.glicose ? `${s.bpm ? ' | ' : ''}🩸 ${s.glicose} mg/dL` : ''}
                        {s.pressao ? `${s.bpm || s.glicose ? ' | ' : ''}🩺 ${s.pressao}` : ''}
                        {s.oxigenacao ? ` | 🫁 ${s.oxigenacao}%` : ''}
                        {s.temperatura ? ` | 🌡️ ${s.temperatura}°C` : ''}
                      </Text>
                    </View>
                  </View>
                );
              }
            })
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Questionário PHQ-9 / GAD-7 */}
      <Modal
        visible={activeQuiz !== null}
        transparent
        animationType="slide"
        onRequestClose={fecharQuestionario}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {activeQuiz === 'PHQ-9' ? 'Questionário PHQ-9 (Depressão)' : 'Questionário GAD-7 (Ansiedade)'}
              </Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={fecharQuestionario}>
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            {quizResult === null ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((stepIndex + 1) / perguntasAtuais.length) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.stepCounter}>
                  Pergunta {stepIndex + 1} de {perguntasAtuais.length}
                </Text>

                <Text style={styles.questionPrompt}>
                  Nas últimas 2 semanas, com que frequência você foi incomodado(a) por:
                </Text>
                <Text style={styles.questionText}>{perguntasAtuais[stepIndex]}</Text>

                {OPCOES_TRIAGEM.map((op) => {
                  const selected = respostaAtual === op.valor;
                  return (
                    <TouchableOpacity
                      key={op.valor}
                      style={[styles.optionButton, selected && styles.optionButtonSelected]}
                      onPress={() => selecionarResposta(op.valor)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {op.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.modalNavRow}>
                  {stepIndex > 0 && (
                    <TouchableOpacity
                      style={styles.modalBackStepBtn}
                      onPress={() => setStepIndex(stepIndex - 1)}
                    >
                      <Text style={styles.modalBackStepText}>Anterior</Text>
                    </TouchableOpacity>
                  )}

                  {stepIndex < perguntasAtuais.length - 1 ? (
                    <TouchableOpacity
                      style={[styles.modalNextBtn, respostaAtual < 0 && { opacity: 0.5 }]}
                      onPress={() => {
                        if (respostaAtual < 0) {
                          mostrarAlerta('Atenção', 'Selecione uma opção para avançar.');
                          return;
                        }
                        setStepIndex(stepIndex + 1);
                      }}
                    >
                      <Text style={styles.modalNextBtnText}>Próxima</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.modalNextBtn, { backgroundColor: '#10B981' }, respostaAtual < 0 && { opacity: 0.5 }]}
                      onPress={finalizarQuestionario}
                    >
                      <Text style={styles.modalNextBtnText}>Calcular Resultado</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.resultBox, { backgroundColor: quizResult.detalhes.corFundo }]}>
                  <Text style={[styles.resultScore, { color: quizResult.detalhes.cor }]}>
                    {quizResult.pontuacao} / {quizResult.maxPontuacao}
                  </Text>
                  <Text style={[styles.resultClass, { color: quizResult.detalhes.cor }]}>
                    {quizResult.detalhes.classificacao}
                  </Text>
                  <Text style={styles.resultOrientation}>{quizResult.detalhes.orientacao}</Text>
                </View>

                {quizResult.detalhes.alertaCritico && (
                  <View style={styles.crisisAlertBox}>
                    <Text style={styles.crisisAlertTitle}>🆘 Apoio Emocional Imediato</Text>
                    <Text style={styles.crisisAlertText}>
                      Você não precisa passar por isso sozinho(a). Ligue gratuitamente para o CVV pelo número 188
                      (atendimento 24h) ou procure o CAPS / pronto-atendimento mais próximo.
                    </Text>
                  </View>
                )}

                <Text style={styles.resultDisclaimer}>
                  Este questionário é uma ferramenta de triagem orientativa e não substitui diagnóstico médico ou
                  psicológico. O resultado foi salvo no seu histórico local.
                </Text>

                <TouchableOpacity style={styles.modalNextBtn} onPress={fecharQuestionario}>
                  <Text style={styles.modalNextBtnText}>Concluir e Ver Histórico</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
