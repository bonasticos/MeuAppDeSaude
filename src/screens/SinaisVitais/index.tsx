import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, FlatList, Platform } from 'react-native';
import { useStore } from '../../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
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
  const [humor, setHumor] = useState<string | null>(null);
  const [exercicio, setExercicio] = useState<boolean | null>(null);
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const addSinalVital = useStore((state) => state.addSinalVital);
  const historico = useStore((state) => state.sinaisVitais);

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
    oxVal: number
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
      Alert.alert(
        '🚨 Alerta de Saúde',
        'Os seguintes sinais vitais registrados requerem atenção:\n\n' + alerts.map(a => '• ' + a).join('\n\n') + '\n\nRecomendamos que repouse e consulte um médico se os sintomas persistirem.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return true;
    }
    return false;
  };

  const hasGlucose = glucose.length > 0;
  const isGlucoseValid = !hasGlucose || (hasGlucose && glicoseTipo !== null);

  const isFormValid = bpm.length > 0 && 
                      glucose.length > 0 && 
                      isGlucoseValid &&
                      pressaoSistolica.length > 0 && 
                      pressaoDiastolica.length > 0 && 
                      oxigenacao.length > 0 && 
                      humor !== null && 
                      exercicio !== null;

  const getMissingFields = () => {
    const missing = [];
    if (bpm.length === 0) missing.push('Batimentos Cardíacos');
    if (glucose.length === 0) missing.push('Glicemia');
    if (glucose.length > 0 && glicoseTipo === null) missing.push('Tipo de Medição de Glicose');
    if (pressaoSistolica.length === 0) missing.push('Pressão Sistólica');
    if (pressaoDiastolica.length === 0) missing.push('Pressão Diastólica');
    if (oxigenacao.length === 0) missing.push('Saturação de Oxigênio');
    if (humor === null) missing.push('Como se sente hoje');
    if (exercicio === null) missing.push('Se fez exercício');
    return missing;
  };

  const handleSave = () => {
    try {
      if (!isFormValid) {
        const missing = getMissingFields();
        if (hasGlucose && !glicoseTipo) {
          Alert.alert('Ops!', 'Como a glicose foi preenchida, o tipo de medição (Jejum, Pré-prandial ou Pós-prandial) é obrigatório.');
        } else {
          Alert.alert('Campos Pendentes', 'Por favor, preencha todos os campos obrigatórios:\n\n' + missing.map(f => '• ' + f).join('\n'));
        }
        return;
      }
      
      const bpmNum = parseInt(bpm, 10);
      const glucoseNum = parseInt(glucose, 10);
      const sysNum = parseInt(pressaoSistolica, 10);
      const diaNum = parseInt(pressaoDiastolica, 10);
      const oxNum = parseInt(oxigenacao, 10);

      const pressaoConsolidada = `${pressaoSistolica}/${pressaoDiastolica}`;

      addSinalVital({ 
        bpm, 
        glicose: glucose, 
        glicoseTipo: glicoseTipo || undefined,
        pressao: pressaoConsolidada,
        oxigenacao,
        humor,
        exercicio
      });
      
      // Validação final de salvamento
      checkVitalsAndNotifyOnSave(bpmNum, glucoseNum, glicoseTipo, sysNum, diaNum, oxNum)
        .then((hadAlerts) => {
          if (!hadAlerts) {
            Alert.alert('Excelente!', 'Seus sinais vitais foram registrados com sucesso. 🩺');
          }
        })
        .catch((err) => {
          console.log('Erro ao analisar alertas:', err);
          Alert.alert('Excelente!', 'Seus sinais vitais foram registrados com sucesso. 🩺');
        });

      setBpm('');
      setGlucose('');
      setGlicoseTipo(null);
      setPressaoSistolica('');
      setPressaoDiastolica('');
      setOxigenacao('');
      setHumor(null);
      setExercicio(null);
      setFocusedInput(null);
    } catch (e: any) {
      console.log('Erro no salvamento:', e);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao salvar: ' + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sinais Vitais (Enfermagem)</Text>
          <Text style={styles.subtitle}>Acompanhe seus indicadores físicos e de enfermagem para controle diário</Text>
        </View>

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
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            Registrar Sinais Vitais
          </Text>
        </TouchableOpacity>

        {/* History */}
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
                      <Text style={styles.historyValue}>
                        {h.glicose} mg/dL {h.glicoseTipo ? `(${h.glicoseTipo})` : ''}
                      </Text>
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
