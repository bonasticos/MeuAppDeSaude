import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Modal, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { BarChartCard, ChartPoint } from '../../components/ClinicaCharts';
import { styles } from './styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

type IntensidadeTreino = 'Leve' | 'Moderado' | 'Intenso';

const COMORBIDADES_OPCOES = ['Diabetes', 'Hipertensão', 'Problema Cardíaco', 'Nenhuma'];
const INTENSIDADES: { tipo: IntensidadeTreino; label: string; met: number }[] = [
  { tipo: 'Leve', label: 'Leve', met: 3.5 },
  { tipo: 'Moderado', label: 'Moderado', met: 5.5 },
  { tipo: 'Intenso', label: 'Intenso', met: 8.0 },
];

export default function ProfileScreen({ navigation }: Props) {
  const { perfil, updatePerfil } = useStore();
  const frequenciaAtividade = perfil?.frequenciaAtividade || null;
  const treinos = useStore((state) => state.treinos || []);
  const addTreino = useStore((state) => state.addTreino);
  const historicoImc = useStore((state) => state.historicoImc || []);
  const addRegistroPesoImc = useStore((state) => state.addRegistroPesoImc);

  const [chartMode, setChartMode] = useState<'peso' | 'imc'>('peso');

  const [age, setAge] = useState(perfil?.idade || '');
  const [weight, setWeight] = useState(perfil?.peso || '');
  const [height, setHeight] = useState(perfil?.altura || '');
  const [gender, setGender] = useState<string | null>(perfil?.sexo || null);
  const [comorbidades, setComorbidades] = useState<string[]>(perfil?.comorbidades || []);
  const [alergias, setAlergias] = useState(perfil?.alergias || '');

  const [imc, setImc] = useState<number | null>(null);
  const [imcClassification, setImcClassification] = useState('');

  // EducacaoFisica states (RF29, RF31)
  const [desc, setDesc] = useState('');
  const [duracaoMin, setDuracaoMin] = useState('');
  const [intensidade, setIntensidade] = useState<IntensidadeTreino>('Moderado');
  const [modalVisible, setModalVisible] = useState(false);

  const hasEditedPerfil = useRef(false);

  // Sincroniza quando o perfil hidrata do armazenamento local
  useEffect(() => {
    if (perfil && !hasEditedPerfil.current) {
      if (perfil.idade !== undefined && perfil.idade !== '') setAge(perfil.idade);
      if (perfil.peso !== undefined && perfil.peso !== '') setWeight(perfil.peso);
      if (perfil.altura !== undefined && perfil.altura !== '') setHeight(perfil.altura);
      if (perfil.sexo !== undefined) setGender(perfil.sexo);
      if (perfil.comorbidades !== undefined) setComorbidades(perfil.comorbidades);
      if (perfil.alergias !== undefined) setAlergias(perfil.alergias);
    }
  }, [perfil]);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

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

  const toggleComorbidade = (item: string) => {
    hasEditedPerfil.current = true;
    let next: string[];
    if (item === 'Nenhuma') {
      next = comorbidades.includes('Nenhuma') ? [] : ['Nenhuma'];
    } else {
      const semNenhuma = comorbidades.filter((c) => c !== 'Nenhuma');
      next = semNenhuma.includes(item)
        ? semNenhuma.filter((c) => c !== item)
        : [...semNenhuma, item];
    }
    setComorbidades(next);
    updatePerfil({ comorbidades: next });
  };

  const handleSaveProfile = () => {
    const temAlgumDado =
      Boolean(age.trim()) ||
      Boolean(weight.trim()) ||
      Boolean(height.trim()) ||
      Boolean(gender) ||
      comorbidades.length > 0 ||
      Boolean(alergias.trim());

    if (!temAlgumDado) {
      mostrarAlerta('Atenção', 'Preencha ao menos um dado corporal, comorbidade ou alergia para salvar.');
      return;
    }

    hasEditedPerfil.current = true;
    const pesoAtualNum = parseFloat(weight.replace(',', '.'));
    updatePerfil({
      idade: age.trim(),
      peso: weight.trim(),
      altura: height.trim(),
      sexo: gender || undefined,
      imc: imc ?? undefined,
      comorbidades,
      alergias: alergias.trim(),
    });

    if (!isNaN(pesoAtualNum) && pesoAtualNum > 0) {
      addRegistroPesoImc({
        peso: Number(pesoAtualNum.toFixed(1)),
        imc: imc !== null ? Number(imc.toFixed(1)) : undefined,
      });
    }

    const dadosCorporaisFaltantes = !age.trim() || !weight.trim() || !height.trim() || !gender;
    mostrarAlerta(
      'Sucesso',
      dadosCorporaisFaltantes
        ? 'Dados de saúde salvos! Preencha Idade, Peso, Altura e Sexo quando quiser calcular seu IMC completo.'
        : 'Perfil corporal e dados de saúde salvos com sucesso!'
    );
  };

  // Cálculo automático da Meta Diária de Água: 35ml × peso corporal (RF13)
  const pesoNumerico = parseFloat((weight || perfil?.peso || '').replace(',', '.'));
  const hasValidPeso = !isNaN(pesoNumerico) && pesoNumerico > 0;
  const metaAguaMl = hasValidPeso ? Math.round(pesoNumerico * 35) : null;
  const metaAguaLitros = metaAguaMl !== null ? (metaAguaMl / 1000).toFixed(2).replace('.', ',') : null;
  const copos250ml = metaAguaMl !== null ? Math.ceil(metaAguaMl / 250) : null;

  // Cálculo de Gasto Calórico (RF29, RF31)
  const duracaoNum = parseInt(duracaoMin.replace(/[^\d]/g, ''), 10);
  const hasValidDuracao = !isNaN(duracaoNum) && duracaoNum > 0;
  const pesoParaTreino = hasValidPeso ? pesoNumerico : 70;
  const metSelecionado = INTENSIDADES.find((i) => i.tipo === intensidade)?.met ?? 5.5;
  const caloriasEstimadas = hasValidDuracao
    ? Math.round(metSelecionado * pesoParaTreino * (duracaoNum / 60))
    : null;

  const handleRegistrarTreino = () => {
    if (!desc.trim()) {
      mostrarAlerta('Atenção', 'Por favor, descreva o treino que você realizou.');
      return;
    }
    if (!hasValidDuracao) {
      mostrarAlerta('Atenção', 'Informe a duração do treino em minutos (ex: 30) para calcular o gasto calórico.');
      return;
    }

    const kcal = caloriasEstimadas ?? 0;
    addTreino({
      descricao: desc.trim(),
      duracaoMinutos: duracaoNum,
      intensidade,
      caloriasEstimadas: kcal,
    });
    mostrarAlerta(
      'Treino Registrado! 🔥',
      `${desc.trim()} (${duracaoNum} min • ${intensidade})\nGasto estimado: ~${kcal} kcal.`
    );
    setDesc('');
    setDuracaoMin('');
  };

  const treinosNaSemana = treinos.length % 6; // Mock para barra de progresso
  const alertaAlergiaTexto = alergias.trim() || (perfil?.alergias || '').trim();

  const evolutionChartData: ChartPoint[] = useMemo(() => {
    const baseRecords = [...historicoImc];
    if (baseRecords.length === 0 && perfil?.peso) {
      const pNum = parseFloat(perfil.peso.replace(',', '.'));
      if (!isNaN(pNum) && pNum > 0) {
        baseRecords.push({
          id: 'baseline-atual',
          peso: Number(pNum.toFixed(1)),
          imc: perfil.imc !== undefined ? Number(perfil.imc.toFixed(1)) : undefined,
          data: new Date().toISOString(),
        });
      }
    }

    const recent = baseRecords.slice(-7);
    const points: ChartPoint[] = [];

    recent.forEach((rec) => {
      const label =
        rec.id === 'baseline-atual'
          ? 'Atual'
          : new Date(rec.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      if (chartMode === 'peso' && rec.peso > 0) {
        points.push({
          label,
          value: rec.peso,
          displayValue: `${rec.peso.toFixed(1)}kg`,
          color: '#0E7490',
        });
      } else if (chartMode === 'imc' && rec.imc !== undefined && rec.imc > 0) {
        let color = '#10B981';
        if (rec.imc < 18.5) color = '#3B82F6';
        else if (rec.imc >= 25 && rec.imc < 30) color = '#F59E0B';
        else if (rec.imc >= 30) color = '#EF4444';

        points.push({
          label,
          value: rec.imc,
          displayValue: rec.imc.toFixed(1),
          color,
        });
      }
    });

    return points;
  }, [historicoImc, perfil?.peso, perfil?.imc, chartMode]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>IMC & Educação Física</Text>
        <Text style={styles.subtitle}>Calcule seu IMC, informe dados clínicos e acompanhe seus treinos físicos.</Text>

        {/* Destaque visual obrigatório para alergias registradas (RF28) */}
        {alertaAlergiaTexto.length > 0 && (
          <View style={styles.allergyBanner}>
            <Text style={styles.allergyBannerTitle}>⚠️ ALERTA CLÍNICO — ALERGIAS REGISTRADAS</Text>
            <Text style={styles.allergyBannerText}>{alertaAlergiaTexto}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Perfil Corporal e Clínico</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Idade</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Sua idade"
              value={age}
              onChangeText={(text) => {
                hasEditedPerfil.current = true;
                setAge(text);
              }}
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
                onChangeText={(text) => {
                  hasEditedPerfil.current = true;
                  setWeight(text);
                }}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput placeholderTextColor="#999"
                style={styles.input}
                placeholder="Ex: 175"
                value={height}
                onChangeText={(text) => {
                  hasEditedPerfil.current = true;
                  setHeight(text);
                }}
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
                onPress={() => {
                  hasEditedPerfil.current = true;
                  setGender(g);
                }}
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

          {/* Comorbidades (RF05) */}
          <Text style={styles.label}>Comorbidades / Condições Pré-existentes</Text>
          <View style={styles.chipsWrap}>
            {COMORBIDADES_OPCOES.map((condicao) => {
              const selected = comorbidades.includes(condicao);
              const isNone = condicao === 'Nenhuma';
              return (
                <TouchableOpacity
                  key={condicao}
                  style={[
                    styles.conditionChip,
                    selected && (isNone ? styles.conditionChipNoneSelected : styles.conditionChipSelected),
                  ]}
                  onPress={() => toggleComorbidade(condicao)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.conditionChipText,
                      selected && (isNone ? styles.conditionChipNoneTextSelected : styles.conditionChipTextSelected),
                    ]}
                  >
                    {selected ? '✓ ' : ''}{condicao}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Alergias (RF28) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Alergias (medicamentos, alimentos ou outras)</Text>
            <TextInput
              placeholderTextColor="#999"
              style={[styles.input, alergias.trim().length > 0 && styles.allergyInputActive]}
              placeholder="Ex: Dipirona, Penicilina, Frutos do mar, Látex"
              value={alergias}
              onChangeText={(text) => {
                hasEditedPerfil.current = true;
                setAlergias(text);
              }}
              multiline
            />
            {alergias.trim().length > 0 && (
              <Text style={styles.allergyHintText}>
                ⚠️ Alergias ficam destacadas no topo do seu perfil para segurança em atendimentos.
              </Text>
            )}
          </View>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#0056b3' }]} onPress={handleSaveProfile}>
            <Text style={styles.actionButtonText}>Salvar Dados Corporais e de Saúde</Text>
          </TouchableOpacity>
        </View>

        {/* Card Meta Diária de Água (RF13) */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeaderRow}>
            <Text style={styles.waterTitle}>💧 Meta Diária de Água (RF13)</Text>
          </View>
          {metaAguaMl !== null ? (
            <>
              <Text style={styles.waterValue}>
                {metaAguaMl} ml ({metaAguaLitros} L)
              </Text>
              <Text style={styles.waterSubtext}>
                Aproximadamente {copos250ml} copos de 250 ml por dia (cálculo padrão: 35 ml × {pesoNumerico} kg).
                {frequenciaAtividade === 'Ativo (Pratico Exercícios)'
                  ? '\n💡 Por ser fisicamente ativo(a), lembre-se de repor líquidos extras durante e após os treinos.'
                  : ''}
              </Text>
            </>
          ) : (
            <Text style={styles.waterSubtext}>
              Informe seu peso corporal (kg) no cartão acima para calcular automaticamente sua meta diária recomendada (35 ml × peso).
            </Text>
          )}
        </View>

        {/* Gráfico de Evolução de Peso e IMC (RF33) */}
        <BarChartCard
          title="📊 Evolução de Peso & IMC (RF33)"
          subtitle={
            chartMode === 'peso'
              ? 'Histórico do seu peso corporal salvo ao atualizar o perfil.'
              : 'Histórico do Índice de Massa Corporal (IMC).'
          }
          data={evolutionChartData}
          emptyMessage={
            chartMode === 'imc'
              ? 'Salve Peso e Altura no perfil para acompanhar a evolução do IMC.'
              : 'Salve seu peso corporal no perfil para acompanhar a evolução ao longo do tempo.'
          }
          legend={
            chartMode === 'imc'
              ? [
                  { label: 'Abaixo (<18.5)', color: '#3B82F6' },
                  { label: 'Normal', color: '#10B981' },
                  { label: 'Sobrepeso', color: '#F59E0B' },
                  { label: 'Obesidade', color: '#EF4444' },
                ]
              : undefined
          }
        >
          <View style={styles.chartToggleRow}>
            <TouchableOpacity
              style={[styles.chartToggleBtn, chartMode === 'peso' && styles.chartToggleBtnActive]}
              onPress={() => setChartMode('peso')}
              activeOpacity={0.75}
            >
              <Text style={[styles.chartToggleText, chartMode === 'peso' && styles.chartToggleTextActive]}>
                ⚖️ Peso (kg)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartToggleBtn, chartMode === 'imc' && styles.chartToggleBtnActive]}
              onPress={() => setChartMode('imc')}
              activeOpacity={0.75}
            >
              <Text style={[styles.chartToggleText, chartMode === 'imc' && styles.chartToggleTextActive]}>
                📏 IMC
              </Text>
            </TouchableOpacity>
          </View>
        </BarChartCard>

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
          <Text style={styles.sectionTitle}>Registrar Treino (RF29 & RF31)</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Atividade realizada</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Ex: Caminhada no parque, Musculação"
              value={desc}
              onChangeText={setDesc}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duração (minutos)</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Ex: 45"
              value={duracaoMin}
              onChangeText={(text) => setDuracaoMin(text.replace(/[^\d]/g, ''))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <Text style={styles.label}>Intensidade</Text>
          <View style={styles.intensityRow}>
            {INTENSIDADES.map((item) => {
              const selected = intensidade === item.tipo;
              return (
                <TouchableOpacity
                  key={item.tipo}
                  style={[styles.intensityBtn, selected && styles.intensityBtnSelected]}
                  onPress={() => setIntensidade(item.tipo)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.intensityBtnText, selected && styles.intensityBtnTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {caloriasEstimadas !== null && (
            <View style={styles.caloriePreviewBox}>
              <Text style={styles.caloriePreviewTitle}>
                🔥 Gasto calórico estimado: ~{caloriasEstimadas} kcal
              </Text>
              <Text style={styles.caloriePreviewSub}>
                Baseado em {duracaoNum} min de intensidade {intensidade.toLowerCase()} ({pesoParaTreino} kg{!hasValidPeso ? ' padrão' : ''}).
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={handleRegistrarTreino}>
            <Text style={styles.actionButtonText}>+ Salvar Treino</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Últimos Treinos</Text>
          {treinos.length === 0 ? (
            <Text style={styles.emptyText}>Você ainda não registrou treinos.</Text>
          ) : (
            treinos.slice().reverse().slice(0, 8).map((t) => (
              <View key={t.id} style={styles.workoutHistoryCard}>
                <Text style={styles.workoutHistoryTitle}>
                  {new Date(t.data).toLocaleDateString('pt-BR')} — {t.descricao}
                </Text>
                {(t.duracaoMinutos || t.intensidade) && (
                  <Text style={styles.workoutHistoryMeta}>
                    {t.duracaoMinutos ? `⏱️ ${t.duracaoMinutos} min` : ''}
                    {t.duracaoMinutos && t.intensidade ? '  •  ' : ''}
                    {t.intensidade ? `Intensidade: ${t.intensidade}` : ''}
                  </Text>
                )}
                {t.caloriasEstimadas !== undefined && t.caloriasEstimadas > 0 && (
                  <View style={styles.workoutKcalBadge}>
                    <Text style={styles.workoutKcalBadgeText}>🔥 ~{t.caloriasEstimadas} kcal gastas</Text>
                  </View>
                )}
              </View>
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


