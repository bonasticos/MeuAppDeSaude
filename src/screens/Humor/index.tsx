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

export default function MoodScreen({ navigation }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'feliz', label: 'Feliz', emoji: 'ðŸ˜Š' },
    { id: 'triste', label: 'Triste', emoji: 'ðŸ˜¢' },
    { id: 'nervoso', label: 'Nervoso', emoji: 'ðŸ˜ ' },
    { id: 'ansioso', label: 'Ansioso', emoji: 'ðŸ˜°' },
  ];


  const addHumor = useStore((state) => state.addHumor);
  const historico = useStore((state) => state.humorHistorico);

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert('Erro', 'Selecione o seu humor.');
      return;
    }
    addHumor({ moodId: selectedMood });
    Alert.alert('Salvo', 'O seu registro de hoje foi salvo com sucesso!');
    setSelectedMood(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Como vocÃª estÃ¡?</Text>

        <Text style={styles.sectionTitle}>Seu Humor Hoje</Text>
        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                selectedMood === mood.id && styles.selectedCard
              ]}
              onPress={() => setSelectedMood(mood.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>


        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>HistÃ³rico Recente</Text>
          {historico.length === 0 ? (
            <Text style={{color: '#666'}}>Nenhum registro ainda.</Text>
          ) : (
            historico.map((h) => {
              const emoji = moods.find(m => m.id === h.moodId)?.emoji || '';
              return (
                <Text key={h.id} style={{color: '#333', marginBottom: 4}}>
                  {new Date(h.data).toLocaleDateString()} - {emoji} {h.activity ? `| Atividade: ${h.activity}` : ''}
                </Text>
              )
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


