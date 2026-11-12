import React, { useMemo, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { BarChartCard, ChartPoint } from '../../components/ClinicaCharts';
import { styles } from './styles';

type FisioterapiaNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Fisioterapia'>;

interface Props {
  navigation: FisioterapiaNavigationProp;
}

export default function TelaFisioterapia({ navigation }: Props) {
  const [nivelDor, setNivelDor] = useState('');
  const historicoDor = useStore((state) => state.historicoDor || []);
  const addRegistroDor = useStore((state) => state.addRegistroDor);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const handleSaveDor = () => {
    const nivel = parseInt(nivelDor, 10);
    if (isNaN(nivel) || nivel < 0 || nivel > 10) {
      mostrarAlerta('Erro', 'Por favor, insira um nível de dor válido (0 a 10).');
      return;
    }
    
    addRegistroDor({ nivel });
    mostrarAlerta('Salvo', 'Nível de dor registrado. Melhoras!');
    setNivelDor('');
  };

  const painChartData: ChartPoint[] = useMemo(() => {
    return (historicoDor || []).slice(-7).map((h) => ({
      label: new Date(h.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: h.nivel,
      displayValue: `${h.nivel}`,
      color: h.nivel <= 3 ? '#10B981' : h.nivel <= 6 ? '#F59E0B' : '#EF4444',
    }));
  }, [historicoDor]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Fisioterapia</Text>
        <Text style={styles.subtitle}>Gerencie suas dores e exercícios terapêuticos.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Registro de Dor (EVA)</Text>
          <Text style={styles.infoText}>Mapeie a intensidade da dor hoje (0 a 10).</Text>
          <TextInput placeholderTextColor="#6B7280" 
            style={styles.input} 
            placeholder="Nível de 0 a 10" 
            keyboardType="numeric"
            value={nivelDor}
            onChangeText={(text) => setNivelDor(text.replace(/[^\d]/g, ''))}
            maxLength={2}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveDor}>
            <Text style={styles.actionButtonText}>Salvar Dor de Hoje</Text>
          </TouchableOpacity>
        </View>

        <BarChartCard
          title="📊 Evolução da Dor (EVA 0–10)"
          subtitle="Acompanhe os últimos 7 registros da Escala Visual Analógica (RF46)."
          maxScale={10}
          data={painChartData}
          emptyMessage="Registre seu nível de dor para acompanhar o gráfico de evolução."
          legend={[
            { label: 'Leve (0–3)', color: '#10B981' },
            { label: 'Moderada (4–6)', color: '#F59E0B' },
            { label: 'Intensa (7–10)', color: '#EF4444' },
          ]}
        />

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Dor</Text>
          {historicoDor.length === 0 ? (
            <Text style={styles.emptyHistory}>Nenhum registro ainda.</Text>
          ) : (
            historicoDor.slice().reverse().slice(0, 10).map((h) => (
              <Text key={h.id} style={styles.historyItemText}>
                {new Date(h.data).toLocaleDateString('pt-BR')}: Dor nível {h.nivel}/10
              </Text>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Plano Terapêutico</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Exercícios de Hoje</Text>
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


