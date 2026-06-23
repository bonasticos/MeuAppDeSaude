import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useStore } from '../../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

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

  const addHumor = useStore((state) => state.addHumor);
  const humorHistorico = useStore((state) => state.humorHistorico);
  const sinaisVitais = useStore((state) => state.sinaisVitais);

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert('Ops!', 'Por favor, selecione como você está se sentindo hoje.');
      return;
    }
    
    if (!selectedActivity) {
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
    Alert.alert('Excelente!', 'Registro completo salvo com sucesso. Isso ajuda muito na sua análise comportamental. 🌟');
    setSelectedMood(null);
    setSelectedActivity(null);
  };

  const getMoodConfig = (moodId: string) => {
    return MOODS.find(m => m.id === moodId) || MOODS[0];
  };

  // Merge histories and sort desc
  const mergedHistory = [
    ...humorHistorico.map(h => ({ type: 'humor', data: h.data, item: h })),
    ...sinaisVitais.map(s => ({ type: 'sinal', data: s.data, item: s }))
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

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Linha do Tempo (Humor & Sinais)</Text>
          
          {mergedHistory.length === 0 ? (
            <Text style={styles.emptyHistory}>Você ainda não possui registros.</Text>
          ) : (
            mergedHistory.slice(0, 8).map((record) => {
              if (record.type === 'humor') {
                const h = record.item as any;
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
              } else {
                const s = record.item as any;
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
                        ❤️ {s.bpm} | 🩸 {s.glicose} | 🩺 {s.pressao}
                        {s.oxigenacao ? ` | 🫁 ${s.oxigenacao}%` : ''}
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
    </SafeAreaView>
  );
}

