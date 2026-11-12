import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, FlatList, Platform, Modal } from 'react-native';
import { useStore } from '../../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { SinalVital } from '../../types';
import { BarChartCard, ChartPoint } from '../../components/ClinicaCharts';
import { styles } from './styles';
import * as Notifications from 'expo-notifications';

// Configure notification behavior for foreground alerts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type VitalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SinaisVitais'>;

interface Props {
  navigation: VitalsScreenNavigationProp;
}

const BASIC_MOODS = ['Bem', 'Neutro', 'Mal'];
const GLICOSE_TIPOS = ['Jejum', 'Pré-prandial', 'Pós-prandial'] as const;

const CHECKLIST_CUIDADOS_ITENS = [
  { id: 'higiene_bucal', titulo: 'Higiene bucal e corporal', desc: 'Escovação dentária, banho assistido e limpeza da pele.' },
  { id: 'hidratacao', titulo: 'Hidratação e cuidado com a pele', desc: 'Ingestão adequada de água e hidratação cutânea.' },
  { id: 'decubito', titulo: 'Mudança de posição (decúbito)', desc: 'Alternar posição a cada 2h para prevenção de lesões por pressão.' },
  { id: 'inspecao_pele', titulo: 'Inspeção de pontos de pressão', desc: 'Checar calcanhares, região sacral, cotovelos e curativos.' },
  { id: 'medicacao', titulo: 'Medicações do turno conferidas', desc: 'Conferir horários, doses prescritas e aceitação.' },
  { id: 'ambiente', titulo: 'Ambiente ventilado e seguro', desc: 'Leito organizado, boa ventilação e prevenção de quedas.' },
];

const getHojeLocalKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

interface VitalLimit {
  min: number;
  max: number;
  healthyMin: number;
  healthyMax: number;
  unit: string;
  label: string;
  name: string;
}

const VITALS_CONFIG: Record<string, VitalLimit> = {
  bpm: {
    min: 0,
    max: 250,
    healthyMin: 50,
    healthyMax: 120,
    unit: 'bpm',
    label: 'Batimentos Cardíacos',
    name: 'bpm'
  },
  glicose: {
    min: 0,
    max: 800,
    healthyMin: 70,
    healthyMax: 140,
    unit: 'mg/dL',
    label: 'Glicemia',
    name: 'glicose'
  },
  pressaoSistolica: {
    min: 60,
    max: 280,
    healthyMin: 110,
    healthyMax: 120,
    unit: 'mmHg',
    label: 'Pressão Sistólica',
    name: 'pressaoSistolica'
  },
  pressaoDiastolica: {
    min: 30,
    max: 200,
    healthyMin: 60,
    healthyMax: 90,
    unit: 'mmHg',
    label: 'Pressão Diastólica',
    name: 'pressaoDiastolica'
  },
  oxigenacao: {
    min: 0,
    max: 100,
    healthyMin: 95,
    healthyMax: 100,
    unit: '%',
    label: 'Saturação de Oxigênio',
    name: 'oxigenacao'
  }
};

// Componente de Roda de Rolagem Vertical (Vertical Wheel Picker)
const VerticalWheelPicker = ({ min, max, value, onChange }: {
  min: number;
  max: number;
  value: string;
  onChange: (val: string) => void;
}) => {
  const numbers = useMemo(() => {
    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }, [min, max]);

  const flatListRef = useRef<FlatList>(null);
  const isUserScrolling = useRef(false);

  // Sincroniza a roda vertical quando o valor muda externamente (ex: digitação)
  useEffect(() => {
    if (isUserScrolling.current) return;
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      const index = num - min;
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: index * 40,
          animated: true,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, min, max]);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / 40);
    if (index >= 0 && index < numbers.length) {
      const selectedValue = numbers[index].toString();
      if (value !== selectedValue) {
        onChange(selectedValue);
      }
    }
  };

  const renderItem = ({ item }: { item: number }) => {
    const selectedNum = parseInt(value, 10);
    const itemIndex = item - min;
    const selectedIndex = isNaN(selectedNum) ? -999 : selectedNum - min;
    const distance = Math.abs(itemIndex - selectedIndex);

    let opacity = 0.2;
    let scale = 0.8;
    
    if (distance === 0) {
      opacity = 1;
      scale = 1.15;
    } else if (distance === 1) {
      opacity = 0.5;
      scale = 0.95;
    } else if (distance === 2) {
      opacity = 0.25;
      scale = 0.85;
    }

    const isSelected = distance === 0;

    return (
      <View style={[styles.rulerItem, { opacity, transform: [{ scale }] }]}>
        <Text style={[styles.rulerText, isSelected && styles.rulerTextSelected]}>
          {item}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.rulerWrapper}>
      <View style={styles.pickerIndicator} pointerEvents="none" />
      <FlatList
        ref={flatListRef}
        data={numbers}
        extraData={value}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.rulerContent}
        snapToInterval={40}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: 40,
          offset: 40 * index,
          index,
        })}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
        }}
        onScrollEndDrag={(e) => {
          isUserScrolling.current = false;
          const y = e.nativeEvent.contentOffset.y;
          const index = Math.round(y / 40);
          flatListRef.current?.scrollToOffset({
            offset: index * 40,
            animated: true,
          });
        }}
        onMomentumScrollBegin={() => {
          isUserScrolling.current = true;
        }}
        onMomentumScrollEnd={(e) => {
          isUserScrolling.current = false;
          const y = e.nativeEvent.contentOffset.y;
          const index = Math.round(y / 40);
          flatListRef.current?.scrollToOffset({
            offset: index * 40,
            animated: true,
          });
        }}
      />
    </View>
  );
};

export default function TelaSinaisVitais({ navigation }: Props) {
  const [bpm, setBpm] = useState('');
  const [glucose, setGlucose] = useState('');
  const [glicoseTipo, setGlicoseTipo] = useState<string | null>(null);
  const [pressaoSistolica, setPressaoSistolica] = useState('');
  const [pressaoDiastolica, setPressaoDiastolica] = useState('');
  const [oxigenacao, setOxigenacao] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [humor, setHumor] = useState<string | null>(null);
  const [exercicio, setExercicio] = useState<boolean | null>(null);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [checklistModalVisible, setChecklistModalVisible] = useState(false);
  const [chartMetric, setChartMetric] = useState<'bpm' | 'glicose' | 'pressao' | 'oxigenacao' | 'temperatura'>('bpm');

  const scrollViewRef = useRef<ScrollView>(null);

  const addSinalVital = useStore((state) => state.addSinalVital);
  const updateSinalVital = useStore((state) => state.updateSinalVital);
  const removeSinalVital = useStore((state) => state.removeSinalVital);
  const historico = useStore((state) => state.sinaisVitais || []);
  const checklistCuidados = useStore((state) => state.checklistCuidados);
  const setChecklistCuidados = useStore((state) => state.setChecklistCuidados);

  const hojeKey = getHojeLocalKey();
  const itensChecklistHoje =
    checklistCuidados?.data === hojeKey ? checklistCuidados.itensConcluidos || [] : [];

  const toggleChecklistItem = (id: string) => {
    const exists = itensChecklistHoje.includes(id);
    const next = exists
      ? itensChecklistHoje.filter((item) => item !== id)
      : [...itensChecklistHoje, id];
    setChecklistCuidados({ data: hojeKey, itensConcluidos: next });
  };

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const lastNotificationTime = useRef<Record<string, number>>({});

  // Solicitar permissões de notificação e configurar canal no Android no mount
  useEffect(() => {
    async function requestPermissions() {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permissão para notificações não foi concedida.');
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF0000',
          });
        }
      } catch (e) {
        console.log('Erro ao configurar notificações:', e);
      }
    }
    requestPermissions();
  }, []);

  const triggerInstantNotification = async (title: string, body: string) => {
    // Evita spam de alertas idênticos em um intervalo curto (8 segundos)
    const key = `${title}:${body}`;
    const now = Date.now();
    if (lastNotificationTime.current[key] && now - lastNotificationTime.current[key] < 8000) {
      return;
    }
    lastNotificationTime.current[key] = now;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
      });
    } catch (err) {
      console.log('Falha ao agendar notificação instantânea:', err);
    }
  };

  // Observadores de Alteração com Debounce para alertas em tempo real
  useEffect(() => {
    if (!bpm) return;
    const delayDebounce = setTimeout(() => {
      const val = parseInt(bpm, 10);
      if (!isNaN(val) && (val < VITALS_CONFIG.bpm.healthyMin || val > VITALS_CONFIG.bpm.healthyMax)) {
        triggerInstantNotification(
          "⚠️ Alerta: Batimentos Cardíacos",
          `Sua frequência cardíaca está em ${val} bpm (faixa saudável: ${VITALS_CONFIG.bpm.healthyMin}-${VITALS_CONFIG.bpm.healthyMax} bpm).`
        );
      }
    }, 1200); // 1.2 segundos de debounce para digitação/rolagem assentar
    return () => clearTimeout(delayDebounce);
  }, [bpm]);

  useEffect(() => {
    if (!glucose || !glicoseTipo) return;
    const delayDebounce = setTimeout(() => {
      const val = parseInt(glucose, 10);
      if (!isNaN(val)) {
        let gMin = 70;
        let gMax = 140;
        if (glicoseTipo === 'Jejum') { gMin = 70; gMax = 99; }
        else if (glicoseTipo === 'Pré-prandial') { gMin = 70; gMax = 129; }
        else if (glicoseTipo === 'Pós-prandial') { gMin = 70; gMax = 140; }

        if (val < gMin || val > gMax) {
          triggerInstantNotification(
            `🩸 Alerta: Glicemia (${glicoseTipo})`,
            `Sua glicemia está em ${val} mg/dL (faixa saudável: ${gMin}-${gMax} mg/dL).`
          );
        }
      }
    }, 1200);
    return () => clearTimeout(delayDebounce);
  }, [glucose, glicoseTipo]);

  useEffect(() => {
    if (!pressaoSistolica || !pressaoDiastolica) return;
    const delayDebounce = setTimeout(() => {
      const sys = parseInt(pressaoSistolica, 10);
      const dia = parseInt(pressaoDiastolica, 10);
      if (!isNaN(sys) && !isNaN(dia)) {
        const alerts = [];
        if (sys < VITALS_CONFIG.pressaoSistolica.healthyMin || sys > VITALS_CONFIG.pressaoSistolica.healthyMax) {
          alerts.push(`Sistólica em ${sys} mmHg (saudável: 110-120).`);
        }
        if (dia < VITALS_CONFIG.pressaoDiastolica.healthyMin || dia > VITALS_CONFIG.pressaoDiastolica.healthyMax) {
          alerts.push(`Diastólica em ${dia} mmHg (saudável: 60-90).`);
        }
        const diff = sys - dia;
        if (diff < 30) {
          alerts.push(`Pressão convergente (diferença muito próxima: ${diff} mmHg).`);
        } else if (diff > 60) {
          alerts.push(`Pressão divergente (diferença muito distante: ${diff} mmHg).`);
        }

        if (alerts.length > 0) {
          triggerInstantNotification(
            "🩺 Alerta: Pressão Arterial",
            alerts.join('\n')
          );
        }
      }
    }, 1200);
    return () => clearTimeout(delayDebounce);
  }, [pressaoSistolica, pressaoDiastolica]);

  useEffect(() => {
    if (!oxigenacao) return;
    const delayDebounce = setTimeout(() => {
      const val = parseInt(oxigenacao, 10);
      if (!isNaN(val) && val < VITALS_CONFIG.oxigenacao.healthyMin) {
        triggerInstantNotification(
          "🫁 Alerta: Saturação de Oxigênio",
          `Sua saturação de oxigênio está em ${val}% (recomendado: >= ${VITALS_CONFIG.oxigenacao.healthyMin}%).`
        );
      }
    }, 1200);
    return () => clearTimeout(delayDebounce);
  }, [oxigenacao]);

  useEffect(() => {
    if (!temperatura || temperatura.endsWith('.')) return;
    const delayDebounce = setTimeout(() => {
      const val = parseFloat(temperatura.replace(',', '.'));
      if (!isNaN(val) && val >= 25 && val <= 43) {
        if (val > 37.8) {
          triggerInstantNotification(
            "🌡️ Alerta: Febre Detectada",
            `Temperatura corporal em ${val.toFixed(1)} °C (> 37.8 °C). Monitore hidratação e procure avaliação médica se persistir.`
          );
        } else if (val < 35.0) {
          triggerInstantNotification(
            "🌡️ Alerta: Hipotermia Detectada",
            `Temperatura corporal em ${val.toFixed(1)} °C (< 35.0 °C). Aqueça o corpo e procure atendimento de saúde.`
          );
        }
      }
    }, 1200);
    return () => clearTimeout(delayDebounce);
  }, [temperatura]);

  const handleTempChange = (text: string) => {
    const normalized = text.replace(',', '.').replace(/[^\d.]/g, '');
    const parts = normalized.split('.');
    let formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : normalized;
    if (parts.length === 2 && parts[1].length > 1) {
      formatted = `${parts[0]}.${parts[1].slice(0, 1)}`;
    }
    const parsed = parseFloat(formatted);
    if (!isNaN(parsed) && parsed > 43) {
      formatted = '43.0';
    }
    setTemperatura(formatted);
  };

  const resetForm = () => {
    setBpm('');
    setGlucose('');
    setGlicoseTipo(null);
    setPressaoSistolica('');
    setPressaoDiastolica('');
    setOxigenacao('');
    setTemperatura('');
    setHumor(null);
    setExercicio(null);
    setFocusedInput(null);
    setEditingId(null);
  };

  const handleStartEdit = (registro: SinalVital) => {
    setEditingId(registro.id);
    setBpm(registro.bpm || '');
    setGlucose(registro.glicose || '');
    setGlicoseTipo(registro.glicoseTipo || null);

    if (registro.pressao && registro.pressao.includes('/')) {
      const [sys, dia] = registro.pressao.split('/');
      setPressaoSistolica((sys || '').trim());
      setPressaoDiastolica((dia || '').trim());
    } else {
      setPressaoSistolica('');
      setPressaoDiastolica('');
    }

    setOxigenacao(registro.oxigenacao || '');
    setTemperatura(registro.temperatura || '');
    setHumor(registro.humor || null);
    setExercicio(registro.exercicio !== undefined ? registro.exercicio : null);
    setFocusedInput(null);

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleDeleteRecord = (id: string) => {
    const executarExclusao = () => {
      removeSinalVital(id);
      if (editingId === id) {
        resetForm();
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm('Excluir registro\n\nDeseja realmente remover esta medição dos últimos registros?')) {
        executarExclusao();
      }
      return;
    }

    Alert.alert(
      'Excluir registro',
      'Deseja realmente remover esta medição dos últimos registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: executarExclusao },
      ]
    );
  };

  const handleInputChange = (text: string, field: keyof typeof VITALS_CONFIG) => {
    const config = VITALS_CONFIG[field];
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned === '') {
      if (field === 'bpm') setBpm('');
      else if (field === 'glicose') {
        setGlucose('');
        setGlicoseTipo(null);
      }
      else if (field === 'pressaoSistolica') setPressaoSistolica('');
      else if (field === 'pressaoDiastolica') setPressaoDiastolica('');
      else if (field === 'oxigenacao') setOxigenacao('');
      return;
    }

    const value = parseInt(cleaned, 10);
    // Limita ao máximo absoluto no momento da digitação
    const finalValue = value > config.max ? config.max.toString() : cleaned;

    if (field === 'bpm') setBpm(finalValue);
    else if (field === 'glicose') setGlucose(finalValue);
    else if (field === 'pressaoSistolica') setPressaoSistolica(finalValue);
    else if (field === 'pressaoDiastolica') setPressaoDiastolica(finalValue);
    else if (field === 'oxigenacao') setOxigenacao(finalValue);
  };

  const handleBlur = (field: keyof typeof VITALS_CONFIG, currentValue: string) => {
    setFocusedInput(null);
    if (currentValue === '') return;
    
    const config = VITALS_CONFIG[field];
    const value = parseInt(currentValue, 10);
    
    // Corrige para o mínimo absoluto no blur
    if (value < config.min) {
      const minStr = config.min.toString();
      if (field === 'bpm') setBpm(minStr);
      else if (field === 'glicose') setGlucose(minStr);
      else if (field === 'pressaoSistolica') setPressaoSistolica(minStr);
      else if (field === 'pressaoDiastolica') setPressaoDiastolica(minStr);
      else if (field === 'oxigenacao') setOxigenacao(minStr);
    }
  };

  // Mantemos a validação e alertas secundários no botão Salvar
  const checkVitalsAndNotifyOnSave = async (
    bpmVal: number,
    glucoseVal: number,
    glucoseTypeVal: string | null,
    sysVal: number,
    diaVal: number,
    oxVal: number,
    tempVal: number
  ): Promise<boolean> => {
    const alerts: string[] = [];

    if (!isNaN(bpmVal) && (bpmVal < VITALS_CONFIG.bpm.healthyMin || bpmVal > VITALS_CONFIG.bpm.healthyMax)) {
      alerts.push(`💓 Batimentos Cardíacos: ${bpmVal} bpm (saudável: ${VITALS_CONFIG.bpm.healthyMin}-${VITALS_CONFIG.bpm.healthyMax})`);
    }

    if (!isNaN(glucoseVal) && glucoseTypeVal) {
      let gMin = 70;
      let gMax = 140;
      if (glucoseTypeVal === 'Jejum') { gMin = 70; gMax = 99; }
      else if (glucoseTypeVal === 'Pré-prandial') { gMin = 70; gMax = 129; }
      else if (glucoseTypeVal === 'Pós-prandial') { gMin = 70; gMax = 140; }

      if (glucoseVal < gMin || glucoseVal > gMax) {
        alerts.push(`🩸 Glicemia (${glucoseTypeVal}): ${glucoseVal} mg/dL (saudável: ${gMin}-${gMax})`);
      }
    }

    if (!isNaN(sysVal) && (sysVal < VITALS_CONFIG.pressaoSistolica.healthyMin || sysVal > VITALS_CONFIG.pressaoSistolica.healthyMax)) {
      alerts.push(`🩺 Pressão Sistólica: ${sysVal} mmHg (saudável: ${VITALS_CONFIG.pressaoSistolica.healthyMin}-${VITALS_CONFIG.pressaoSistolica.healthyMax})`);
    }

    if (!isNaN(diaVal) && (diaVal < VITALS_CONFIG.pressaoDiastolica.healthyMin || diaVal > VITALS_CONFIG.pressaoDiastolica.healthyMax)) {
      alerts.push(`🩺 Pressão Diastólica: ${diaVal} mmHg (saudável: ${VITALS_CONFIG.pressaoDiastolica.healthyMin}-${VITALS_CONFIG.pressaoDiastolica.healthyMax})`);
    }

    if (!isNaN(sysVal) && !isNaN(diaVal)) {
      const pulsePressure = sysVal - diaVal;
      if (pulsePressure < 30) {
        alerts.push(`⚠️ Pressão Convergente (diferença de ${pulsePressure} mmHg está muito próxima)`);
      } else if (pulsePressure > 60) {
        alerts.push(`⚠️ Pressão Divergente (diferença de ${pulsePressure} mmHg está muito distante)`);
      }
    }

    if (!isNaN(oxVal) && oxVal < VITALS_CONFIG.oxigenacao.healthyMin) {
      alerts.push(`🫁 Saturação de Oxigênio: ${oxVal}% (saudável >= ${VITALS_CONFIG.oxigenacao.healthyMin}%)`);
    }

    if (!isNaN(tempVal)) {
      if (tempVal > 37.8) {
        alerts.push(`🌡️ Temperatura Corporal: ${tempVal.toFixed(1)} °C — Atenção: Febre (> 37.8 °C)`);
      } else if (tempVal < 35.0) {
        alerts.push(`🌡️ Temperatura Corporal: ${tempVal.toFixed(1)} °C — Atenção: Hipotermia (< 35.0 °C)`);
      }
    }

    if (alerts.length > 0) {
      // Dispara notificação nativa final de resumo
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🚨 Resumo de Sinais Vitais Fora da Faixa!",
            body: alerts.join('\n'),
            sound: true,
          },
          trigger: null,
        });
      } catch (err) {
        console.log('Falha ao agendar notificação:', err);
      }

      // Alerta visual no app
      mostrarAlerta(
        '🚨 Alerta de Saúde',
        'Os seguintes sinais vitais registrados requerem atenção:\n\n' + alerts.map(a => '• ' + a).join('\n\n') + '\n\nRecomendamos que repouse e consulte um médico se os sintomas persistirem.'
      );
      return true;
    }
    return false;
  };

  const hasGlucose = glucose.length > 0;
  const isGlucoseValid = !hasGlucose || (hasGlucose && glicoseTipo !== null);
  const isPressaoValid = (pressaoSistolica.length > 0 && pressaoDiastolica.length > 0) || (pressaoSistolica.length === 0 && pressaoDiastolica.length === 0);
  const tempClean = temperatura.replace(',', '.').trim();
  const tempParsed = tempClean ? parseFloat(tempClean) : NaN;
  const isTempValid = !tempClean || (!isNaN(tempParsed) && tempParsed >= 30 && tempParsed <= 43 && !tempClean.endsWith('.'));
  const hasAnyVital = bpm.length > 0 || hasGlucose || (pressaoSistolica.length > 0 && pressaoDiastolica.length > 0) || oxigenacao.length > 0 || tempClean.length > 0 || humor !== null || exercicio !== null;

  const isFormValid = hasAnyVital && isGlucoseValid && isPressaoValid && isTempValid;

  const handleSave = () => {
    try {
      if (!isFormValid) {
        if (!isGlucoseValid) {
          mostrarAlerta('Ops!', 'Como a glicose foi preenchida, o tipo de medição (Jejum, Pré-prandial ou Pós-prandial) é obrigatório.');
        } else if (!isPressaoValid) {
          mostrarAlerta('Ops!', 'Para registrar a pressão arterial, preencha tanto a Sistólica quanto a Diastólica.');
        } else if (!isTempValid) {
          mostrarAlerta('Ops!', 'Informe uma temperatura corporal válida entre 30.0 °C e 43.0 °C.');
        } else {
          mostrarAlerta('Atenção', 'Por favor, preencha pelo menos um sinal vital ou informação para registrar.');
        }
        return;
      }

      const bpmNum = parseInt(bpm, 10);
      const glucoseNum = parseInt(glucose, 10);
      const sysNum = parseInt(pressaoSistolica, 10);
      const diaNum = parseInt(pressaoDiastolica, 10);
      const oxNum = parseInt(oxigenacao, 10);
      const tempNum = tempClean ? parseFloat(tempClean) : NaN;

      const pressaoConsolidada = (pressaoSistolica && pressaoDiastolica) ? `${pressaoSistolica}/${pressaoDiastolica}` : undefined;
      const payload = {
        bpm,
        glicose: glucose,
        glicoseTipo: glicoseTipo || undefined,
        pressao: pressaoConsolidada,
        oxigenacao,
        temperatura: tempClean ? tempNum.toFixed(1) : undefined,
        humor: humor !== null ? humor : undefined,
        exercicio: exercicio !== null ? exercicio : undefined,
      };

      const estavaEditando = editingId !== null;
      if (editingId) {
        updateSinalVital(editingId, payload);
      } else {
        addSinalVital(payload);
      }

      const msgSucesso = estavaEditando
        ? 'Registro de sinais vitais atualizado com sucesso. ✏️'
        : 'Seus sinais vitais foram registrados com sucesso. 🩺';

      // Validação final de salvamento
      checkVitalsAndNotifyOnSave(bpmNum, glucoseNum, glicoseTipo, sysNum, diaNum, oxNum, tempNum)
        .then((hadAlerts) => {
          if (!hadAlerts) {
            mostrarAlerta('Excelente!', msgSucesso);
          }
        })
        .catch((err) => {
          console.log('Erro ao analisar alertas:', err);
          mostrarAlerta('Excelente!', msgSucesso);
        });

      resetForm();
    } catch (e: any) {
      console.log('Erro no salvamento:', e);
      mostrarAlerta('Erro', 'Ocorreu um erro inesperado ao salvar: ' + e.message);
    }
  };

  const hasValidTempPreview =
    tempClean.length >= 2 && !tempClean.endsWith('.') && !isNaN(tempParsed) && tempParsed >= 25 && tempParsed <= 43;
  const isFebre = hasValidTempPreview && tempParsed > 37.8;
  const isHipotermia = hasValidTempPreview && tempParsed < 35.0;

  const chartConfig = useMemo(() => {
    const metrics: {
      id: typeof chartMetric;
      label: string;
      subtitle: string;
      unit: string;
      maxScale?: number;
    }[] = [
      { id: 'bpm', label: '❤️ BPM', subtitle: 'Faixa saudável: 50 a 120 bpm', unit: '' },
      { id: 'glicose', label: '🩸 Glicose', subtitle: 'Referência geral: 70 a 140 mg/dL', unit: '' },
      { id: 'pressao', label: '🩺 Pressão', subtitle: 'Pressão Arterial Sistólica (mmHg)', unit: '' },
      { id: 'oxigenacao', label: '🫁 SpO2', subtitle: 'Saturação de oxigênio (recomendado ≥ 95%)', unit: '%', maxScale: 100 },
      { id: 'temperatura', label: '🌡️ Temp.', subtitle: 'Temperatura corporal normal: 35.0 a 37.8 °C', unit: '°', maxScale: 43 },
    ];

    const current = metrics.find((m) => m.id === chartMetric) || metrics[0];
    const points: ChartPoint[] = [];

    historico.forEach((h) => {
      const dateObj = new Date(h.data);
      const label = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      if (chartMetric === 'bpm' && h.bpm) {
        const val = parseInt(h.bpm, 10);
        if (!isNaN(val) && val > 0) {
          points.push({
            label,
            value: val,
            displayValue: `${val}`,
            color: val < 50 || val > 120 ? '#EF4444' : '#10B981',
          });
        }
      } else if (chartMetric === 'glicose' && h.glicose) {
        const val = parseInt(h.glicose, 10);
        if (!isNaN(val) && val > 0) {
          points.push({
            label,
            value: val,
            displayValue: `${val}`,
            color: val < 70 || val > 140 ? '#EF4444' : '#10B981',
          });
        }
      } else if (chartMetric === 'pressao' && h.pressao) {
        const [sysRaw] = h.pressao.split('/');
        const sysVal = parseInt((sysRaw || '').trim(), 10);
        if (!isNaN(sysVal) && sysVal > 0) {
          points.push({
            label,
            value: sysVal,
            displayValue: h.pressao,
            color: sysVal < 100 || sysVal > 130 ? '#EF4444' : '#10B981',
          });
        }
      } else if (chartMetric === 'oxigenacao' && h.oxigenacao) {
        const val = parseInt(h.oxigenacao, 10);
        if (!isNaN(val) && val > 0) {
          points.push({
            label,
            value: val,
            displayValue: `${val}%`,
            color: val < 95 ? '#EF4444' : '#10B981',
          });
        }
      } else if (chartMetric === 'temperatura' && h.temperatura) {
        const val = parseFloat(h.temperatura);
        if (!isNaN(val) && val > 0) {
          points.push({
            label,
            value: val,
            displayValue: `${val.toFixed(1)}°`,
            color: val > 37.8 || val < 35.0 ? '#EF4444' : '#10B981',
          });
        }
      }
    });

    return {
      metrics,
      current,
      data: points.slice(-7),
    };
  }, [historico, chartMetric]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sinais Vitais (Enfermagem)</Text>
          <Text style={styles.subtitle}>Acompanhe seus indicadores físicos e de enfermagem para controle diário</Text>
        </View>

        {editingId && (
          <View style={styles.editingBanner}>
            <Text style={styles.editingBannerText}>
              ✏️ Editando uma medição existente. Ajuste os campos e toque em Salvar Alterações.
            </Text>
            <TouchableOpacity style={styles.editingCancelBtn} onPress={resetForm}>
              <Text style={styles.editingCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          {/* Batimentos Cardiacos */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Text>❤️</Text>
              </View>
              <Text style={styles.label}>
                Batimentos Cardíacos {bpm ? `(${bpm} bpm)` : ''}
              </Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'bpm' && styles.inputFocused]}
              placeholder="Ex: 75"
              keyboardType="numeric"
              value={bpm}
              onChangeText={(text) => handleInputChange(text, 'bpm')}
              onFocus={() => setFocusedInput('bpm')}
              onBlur={() => handleBlur('bpm', bpm)}
              maxLength={3}
            />
            {focusedInput === 'bpm' && (
              <VerticalWheelPicker
                min={VITALS_CONFIG.bpm.min}
                max={VITALS_CONFIG.bpm.max}
                value={bpm}
                onChange={(val) => handleInputChange(val, 'bpm')}
              />
            )}
          </View>

          {/* Glicose */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Text>🩸</Text>
              </View>
              <Text style={styles.label}>
                Glicemia {glucose ? `(${glucose} mg/dL)` : ''}
              </Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'glicose' && styles.inputFocused]}
              placeholder="Ex: 90"
              keyboardType="numeric"
              value={glucose}
              onChangeText={(text) => handleInputChange(text, 'glicose')}
              onFocus={() => setFocusedInput('glicose')}
              onBlur={() => handleBlur('glicose', glucose)}
              maxLength={3}
            />
            {focusedInput === 'glicose' && (
              <VerticalWheelPicker
                min={VITALS_CONFIG.glicose.min}
                max={VITALS_CONFIG.glicose.max}
                value={glucose}
                onChange={(val) => handleInputChange(val, 'glicose')}
              />
            )}
            {glucose.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.label, { fontSize: 14, color: glicoseTipo ? '#3B82F6' : '#EF4444' }]}>
                  Tipo de Medição * {glicoseTipo ? `(${glicoseTipo})` : '(Obrigatório)'}
                </Text>
                <View style={styles.glicoseChipsContainer}>
                  {GLICOSE_TIPOS.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.glicoseChip,
                        glicoseTipo === t && styles.glicoseChipSelected
                      ]}
                      onPress={() => setGlicoseTipo(t)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.glicoseChipText,
                        glicoseTipo === t && styles.glicoseChipTextSelected
                      ]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Pressão Arterial */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Text>🩺</Text>
              </View>
              <Text style={styles.label}>
                Pressão Arterial {pressaoSistolica && pressaoDiastolica ? ` (${pressaoSistolica}/${pressaoDiastolica} mmHg)` : ''}
              </Text>
            </View>
            <View style={styles.rowInputs}>
              <View style={styles.rowInputContainer}>
                <Text style={[styles.label, { fontSize: 13, marginBottom: 4, color: '#6B7280' }]}>Sistólica</Text>
                <TextInput 
                  placeholderTextColor="#A0A0AB"
                  style={[styles.input, focusedInput === 'pressaoSistolica' && styles.inputFocused]}
                  placeholder="Ex: 120"
                  keyboardType="numeric"
                  value={pressaoSistolica}
                  onChangeText={(text) => handleInputChange(text, 'pressaoSistolica')}
                  onFocus={() => setFocusedInput('pressaoSistolica')}
                  onBlur={() => handleBlur('pressaoSistolica', pressaoSistolica)}
                  maxLength={3}
                />
              </View>
              <View style={styles.rowInputContainer}>
                <Text style={[styles.label, { fontSize: 13, marginBottom: 4, color: '#6B7280' }]}>Diastólica</Text>
                <TextInput 
                  placeholderTextColor="#A0A0AB"
                  style={[styles.input, focusedInput === 'pressaoDiastolica' && styles.inputFocused]}
                  placeholder="Ex: 80"
                  keyboardType="numeric"
                  value={pressaoDiastolica}
                  onChangeText={(text) => handleInputChange(text, 'pressaoDiastolica')}
                  onFocus={() => setFocusedInput('pressaoDiastolica')}
                  onBlur={() => handleBlur('pressaoDiastolica', pressaoDiastolica)}
                  maxLength={3}
                />
              </View>
            </View>
            {focusedInput === 'pressaoSistolica' && (
              <VerticalWheelPicker
                min={VITALS_CONFIG.pressaoSistolica.min}
                max={VITALS_CONFIG.pressaoSistolica.max}
                value={pressaoSistolica}
                onChange={(val) => handleInputChange(val, 'pressaoSistolica')}
              />
            )}
            {focusedInput === 'pressaoDiastolica' && (
              <VerticalWheelPicker
                min={VITALS_CONFIG.pressaoDiastolica.min}
                max={VITALS_CONFIG.pressaoDiastolica.max}
                value={pressaoDiastolica}
                onChange={(val) => handleInputChange(val, 'pressaoDiastolica')}
              />
            )}
          </View>
          
          {/* Oxigenacao */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                <Text>🫁</Text>
              </View>
              <Text style={styles.label}>
                Saturação de Oxigênio {oxigenacao ? `(${oxigenacao}%)` : ''}
              </Text>
            </View>
            <TextInput 
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'oxigenacao' && styles.inputFocused]}
              placeholder="Ex: 98"
              keyboardType="numeric"
              value={oxigenacao}
              onChangeText={(text) => handleInputChange(text, 'oxigenacao')}
              onFocus={() => setFocusedInput('oxigenacao')}
              onBlur={() => handleBlur('oxigenacao', oxigenacao)}
              maxLength={3}
            />
            {focusedInput === 'oxigenacao' && (
              <VerticalWheelPicker
                min={VITALS_CONFIG.oxigenacao.min}
                max={VITALS_CONFIG.oxigenacao.max}
                value={oxigenacao}
                onChange={(val) => handleInputChange(val, 'oxigenacao')}
              />
            )}
          </View>

          {/* Temperatura Corporal (RF22) */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Text>🌡️</Text>
              </View>
              <Text style={styles.label}>
                Temperatura Corporal {hasValidTempPreview ? `(${tempParsed.toFixed(1)} °C)` : ''}
              </Text>
            </View>
            <TextInput
              placeholderTextColor="#A0A0AB"
              style={[styles.input, focusedInput === 'temperatura' && styles.inputFocused]}
              placeholder="Ex: 36.5"
              keyboardType="decimal-pad"
              value={temperatura}
              onChangeText={handleTempChange}
              onFocus={() => setFocusedInput('temperatura')}
              onBlur={() => setFocusedInput(null)}
              maxLength={4}
            />
            {isFebre && (
              <View style={[styles.tempAlertBox, styles.tempAlertFever]}>
                <Text style={styles.tempAlertTextFever}>
                  ⚠️ Alerta de Febre ({tempParsed.toFixed(1)} °C &gt; 37.8 °C). Hidrate-se e procure orientação de saúde se persistir.
                </Text>
              </View>
            )}
            {isHipotermia && (
              <View style={[styles.tempAlertBox, styles.tempAlertHypo]}>
                <Text style={styles.tempAlertTextHypo}>
                  ❄️ Alerta de Hipotermia ({tempParsed.toFixed(1)} °C &lt; 35.0 °C). Mantenha-se aquecido(a) e procure avaliação clínica.
                </Text>
              </View>
            )}
            {hasValidTempPreview && !isFebre && !isHipotermia && (
              <View style={[styles.tempAlertBox, styles.tempAlertNormal]}>
                <Text style={styles.tempAlertTextNormal}>
                  ✅ Temperatura dentro da faixa esperada (35.0 – 37.8 °C).
                </Text>
              </View>
            )}
          </View>

          {/* Mood */}
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

          {/* Exercise */}
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
          style={[styles.saveButton, editingId !== null && { backgroundColor: '#D97706' }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {editingId ? 'Salvar Alterações' : 'Registrar Sinais Vitais'}
          </Text>
        </TouchableOpacity>

        {/* Checklist Diário de Cuidados Básicos e Higiene (RF27) */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>🧴 Checklist Diário de Cuidados (RF27)</Text>
            <View
              style={[
                styles.checklistBadge,
                itensChecklistHoje.length === CHECKLIST_CUIDADOS_ITENS.length && styles.checklistBadgeDone,
              ]}
            >
              <Text
                style={[
                  styles.checklistBadgeText,
                  itensChecklistHoje.length === CHECKLIST_CUIDADOS_ITENS.length && styles.checklistBadgeTextDone,
                ]}
              >
                {itensChecklistHoje.length}/{CHECKLIST_CUIDADOS_ITENS.length} hoje
              </Text>
            </View>
          </View>

          <Text style={styles.checklistSubtitle}>
            Acompanhe os cuidados básicos de enfermagem, higiene, hidratação e prevenção de lesões no dia de hoje.
          </Text>

          <View style={styles.checklistProgressTrack}>
            <View
              style={[
                styles.checklistProgressFill,
                { width: `${(itensChecklistHoje.length / CHECKLIST_CUIDADOS_ITENS.length) * 100}%` },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.checklistOpenBtn}
            onPress={() => setChecklistModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.checklistOpenBtnText}>Abrir Checklist de Cuidados</Text>
          </TouchableOpacity>
        </View>

        {/* Gráfico de Evolução de Sinais Vitais */}
        <BarChartCard
          title="📊 Evolução dos Sinais Vitais"
          subtitle={chartConfig.current.subtitle}
          unit={chartConfig.current.unit}
          maxScale={chartConfig.current.maxScale}
          data={chartConfig.data}
          emptyMessage={`Sem medições suficientes de ${chartConfig.current.label.replace(/^[^\s]+\s/, '')} para gerar o gráfico.`}
          legend={[
            { label: 'Dentro da faixa', color: '#10B981' },
            { label: 'Requer atenção', color: '#EF4444' },
          ]}
        >
          <View style={styles.chartTabsRow}>
            {chartConfig.metrics.map((metric) => {
              const active = chartMetric === metric.id;
              return (
                <TouchableOpacity
                  key={metric.id}
                  style={[styles.chartTab, active && styles.chartTabActive]}
                  onPress={() => setChartMetric(metric.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chartTabText, active && styles.chartTabTextActive]}>
                    {metric.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BarChartCard>

        {/* History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Últimos Registros</Text>

          {historico.length === 0 ? (
            <Text style={styles.emptyHistory}>Você ainda não tem registros.</Text>
          ) : (
            historico.slice().reverse().slice(0, 10).map((h) => {
              const dateObj = new Date(h.data);
              const isBeingEdited = editingId === h.id;
              return (
                <View
                  key={h.id}
                  style={[
                    styles.historyCard,
                    isBeingEdited && { borderWidth: 1.5, borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
                  ]}
                >
                  <View style={styles.historyDateContainer}>
                    <Text style={styles.historyTime}>
                      {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.historyDate}>
                      {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </Text>
                  </View>

                  <View style={styles.historyContent}>
                    {h.bpm ? (
                      <View style={styles.historyRow}>
                        <Text>❤️</Text>
                        <Text style={styles.historyValue}>{h.bpm} bpm</Text>
                      </View>
                    ) : null}
                    {h.glicose ? (
                      <View style={styles.historyRow}>
                        <Text>🩸</Text>
                        <Text style={styles.historyValue}>
                          {h.glicose} mg/dL {h.glicoseTipo ? `(${h.glicoseTipo})` : ''}
                        </Text>
                      </View>
                    ) : null}
                    {h.pressao ? (
                      <View style={styles.historyRow}>
                        <Text>🩺</Text>
                        <Text style={styles.historyValue}>{h.pressao} mmHg</Text>
                      </View>
                    ) : null}
                    {h.oxigenacao ? (
                      <View style={styles.historyRow}>
                        <Text>🫁</Text>
                        <Text style={styles.historyValue}>{h.oxigenacao}% SpO2</Text>
                      </View>
                    ) : null}
                    {h.temperatura ? (
                      <View style={styles.historyRow}>
                        <Text>🌡️</Text>
                        <Text style={styles.historyValue}>{h.temperatura} °C</Text>
                      </View>
                    ) : null}
                    {(h.humor || h.exercicio !== undefined) && (
                      <View style={[styles.historyRow, { marginTop: 4, flexWrap: 'wrap' }]}>
                        {h.humor && <Text style={{ fontSize: 15, color: '#374151', marginRight: 8 }}>Humor: {h.humor}</Text>}
                        {h.exercicio !== undefined && <Text style={{ fontSize: 15, color: '#374151' }}>Exercício: {h.exercicio ? 'Sim' : 'Não'}</Text>}
                      </View>
                    )}

                    <View style={styles.historyActionsRow}>
                      <TouchableOpacity
                        style={styles.historyEditBtn}
                        onPress={() => handleStartEdit(h)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.historyEditBtnText}>✏️ Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.historyDeleteBtn}
                        onPress={() => handleDeleteRecord(h.id)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.historyDeleteBtnText}>🗑️ Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Checklist Diário de Cuidados (RF27) */}
      <Modal
        visible={checklistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChecklistModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Checklist de Cuidados ({itensChecklistHoje.length}/{CHECKLIST_CUIDADOS_ITENS.length})</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setChecklistModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Marque os itens concluídos hoje ({new Date().toLocaleDateString('pt-BR')}). O progresso fica salvo para o turno atual.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CHECKLIST_CUIDADOS_ITENS.map((item) => {
                const checked = itensChecklistHoje.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.checklistItem, checked && styles.checklistItemChecked]}
                    onPress={() => toggleChecklistItem(item.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                    <View style={styles.checklistItemTextWrap}>
                      <Text style={[styles.checklistItemTitle, checked && styles.checklistItemTitleChecked]}>
                        {item.titulo}
                      </Text>
                      <Text style={styles.checklistItemDesc}>{item.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {itensChecklistHoje.length === CHECKLIST_CUIDADOS_ITENS.length && (
                <View style={styles.checklistDoneBanner}>
                  <Text style={styles.checklistDoneBannerText}>
                    ✅ Todos os cuidados diários de enfermagem foram concluídos hoje!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
