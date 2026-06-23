import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  
  const [imc, setImc] = useState<number | null>(null);
  const [imcClassification, setImcClassification] = useState('');

  // EducacaoFisica states
  const [desc, setDesc] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { perfil, updatePerfil } = useStore();
  const frequenciaAtividade = perfil?.frequenciaAtividade || null;
  const treinos = useStore((state) => state.treinos);
  const addTreino = useStore((state) => state.addTreino);

  const genders = ['Masculino', 'Feminino', 'Outro'];
  const activities = [
    'Ativo (Pratico Exercícios)',
    'De Vez em Quando',
    'Não Pratico'
  ];

  const biblioteca = [
    { nome: 'Caminhada Rápida', desc: 'Caminhe em um ritmo acelerado por 30 minutos. Ótimo para a saúde do coração e perda de calorias.' },
    { nome: 'Alongamento Matinal', desc: 'Estique os braços, pernas e costas logo após acordar. Melhora a flexibilidade e postura diária.' },
    { nome: 'Agachamento Simples', desc: 'Faça 3 séries de 12 repetições. Mantenha as costas retas e o peso nos calcanhares.' },
    { nome: 'Flexão de Braços', desc: 'Apoie os joelhos no chão se for iniciante. Tente fazer 3 séries do máximo que conseguir.' },
  ];

  // IMC Calculation logic
  useEffect(() => {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.')) / 100;

    if (w > 0 && h > 0) {
      const calculatedImc = w / (h * h);
      setImc(calculatedImc);

      if (calculatedImc < 18.5) {
        setImcClassification('Abaixo do peso');
      } else if (calculatedImc >= 18.5 && calculatedImc < 24.9) {
        setImcClassification('Normal');
      } else if (calculatedImc >= 25 && calculatedImc < 29.9) {
        setImcClassification('Sobrepeso');
      } else {
        setImcClassification('Obesidade');
      }
    } else {
      setImc(null);
      setImcClassification('');
    }
  }, [weight, height]);

  const handleSaveProfile = () => {
    if (!age || !weight || !height || !gender) {
      Alert.alert('Atenção', 'Preencha todos os campos do perfil (Idade, Peso, Altura, Sexo).');
      return;
    }
    Alert.alert('Sucesso', 'Perfil salvo com sucesso!', [
      { text: 'OK' }
    ]);
  };

  const handleRegistrarTreino = () => {
    if (!desc) {
      Alert.alert('Erro', 'Por favor, descreva o treino que você realizou.');
      return;
    }
    addTreino({ descricao: desc });
    Alert.alert('Sucesso', 'Treino registrado! Continue assim!');
    setDesc('');
  };

  const treinosNaSemana = treinos.length % 6; // Mock para barra de progresso

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>IMC & Educação Física</Text>
        <Text style={styles.subtitle}>Calcule seu IMC e acompanhe seus treinos físicos em um só lugar.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calculadora de IMC</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Idade</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Sua idade"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput placeholderTextColor="#999"
                style={styles.input}
                placeholder="Ex: 70.5"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput placeholderTextColor="#999"
                style={styles.input}
                placeholder="Ex: 175"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Sexo</Text>
          <View style={styles.genderContainer}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderButton, gender === g && styles.selectedGender]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderText, gender === g && styles.selectedGenderText]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {imc !== null && (
            <View style={styles.imcContainer}>
              <Text style={styles.imcTitle}>Seu IMC: {imc.toFixed(1)}</Text>
              <Text style={styles.imcClass}>{imcClassification}</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#0056b3' }]} onPress={handleSaveProfile}>
            <Text style={styles.actionButtonText}>Salvar Dados Corporais</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Frequência de Atividades</Text>
          <View style={styles.activityList}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.activityButton,
                  frequenciaAtividade === activity && styles.selectedActivityButton
                ]}
                onPress={() => updatePerfil({ frequenciaAtividade: activity })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.activityText,
                  frequenciaAtividade === activity && styles.selectedActivityText
                ]}>{activity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
          <TouchableOpacity style={styles.actionButton} onPress={handleRegistrarTreino}>
            <Text style={styles.actionButtonText}>+ Salvar Treino</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Últimos Treinos</Text>
          {treinos.length === 0 ? (
            <Text style={{color: '#666'}}>Você ainda não registrou treinos.</Text>
          ) : (
            treinos.slice().reverse().slice(0, 5).map((t) => (
              <Text key={t.id} style={{color: '#333', marginBottom: 4, fontSize: 16}}>
                {new Date(t.data).toLocaleDateString('pt-BR')}: {t.descricao}
              </Text>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => setModalVisible(true)}>
          <Text style={styles.actionButtonTextSecondary}>Biblioteca de Exercícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('Inicial')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Biblioteca de Exercícios</Text>
            <ScrollView>
              {biblioteca.map((item, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{item.nome}</Text>
                  <Text style={styles.exerciseDesc}>{item.desc}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}


