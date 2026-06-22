import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type FisioterapiaNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Fisioterapia'>;

interface Props {
  navigation: FisioterapiaNavigationProp;
}

export default function TelaFisioterapia({ navigation }: Props) {
  const [nivelDor, setNivelDor] = useState('');
  const historicoDor = useStore((state) => state.historicoDor);
  const addRegistroDor = useStore((state) => state.addRegistroDor);

  const handleSaveDor = () => {
    const nivel = parseInt(nivelDor);
    if (isNaN(nivel) || nivel < 0 || nivel > 10) {
      Alert.alert('Erro', 'Por favor, insira um nÃ­vel de dor vÃ¡lido (0 a 10).');
      return;
    }
    
    addRegistroDor({ nivel });
    Alert.alert('Salvo', 'NÃ­vel de dor registrado. Melhoras!');
    setNivelDor('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Fisioterapia</Text>
        <Text style={styles.subtitle}>Gerencie suas dores e exercÃ­cios terapÃªuticos.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Registro de Dor (EVA)</Text>
          <Text style={styles.infoText}>Mapeie a intensidade da dor hoje (0 a 10).</Text>
          <TextInput placeholderTextColor="#999" 
            style={styles.input} 
            placeholder="NÃ­vel de 0 a 10" 
            keyboardType="numeric"
            value={nivelDor}
            onChangeText={setNivelDor}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveDor}>
            <Text style={styles.actionButtonText}>Salvar Dor de Hoje</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>EvoluÃ§Ã£o da Dor</Text>
          {historicoDor.length === 0 ? (
            <Text style={{color: '#666'}}>Nenhum registro ainda.</Text>
          ) : (
            historicoDor.map((h) => (
              <Text key={h.id} style={{color: '#333', marginBottom: 4}}>
                {new Date(h.data).toLocaleDateString()}: Dor nÃ­vel {h.nivel}
              </Text>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Plano TerapÃªutico</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>ExercÃ­cios de Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Lembretes de Postura</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


