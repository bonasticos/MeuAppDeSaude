import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Alert, 
  Modal, 
  TextInput, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

// Configuração do comportamento de notificações em primeiro plano (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Tipagem para Navegação
type RemindersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lembretes'>;

interface Props {
  navigation: RemindersScreenNavigationProp;
}

// Interfaces de Tipo de Lembretes
interface LembreteBase {
  id: string;
  tipo: 'remedio' | 'acao';
  concluido: boolean;
  horario: string; // Ex: 08:00
  notificationId?: string; // ID para cancelamento posterior
}

export interface LembreteRemedio extends LembreteBase {
  tipo: 'remedio';
  nomeRemedio: string;
  frequencia: string;
  observacoes?: string;
}

export interface LembreteAcao extends LembreteBase {
  tipo: 'acao';
  tipoAcao: 'consulta' | 'exercicio' | 'agua' | 'pressao' | 'outro';
  acaoPersonalizada?: string;
}

export type LembreteApp = LembreteRemedio | LembreteAcao;

// Interface de Tipo de Medicamento do Estoque
export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  forma: string;
  estoque: string;
}

// Chaves de armazenamento
const LEMBRETES_KEY = '@lembretes_saude_v4';
const MEDICAMENTOS_KEY = '@medicamentos_saude_v4';

export default function TelaLembretes({ navigation }: Props) {
  // Aba ativa: Lembretes ('lembretes') ou Estoque Médico ('farmacia')
  const [activeTab, setActiveTab] = useState<'lembretes' | 'farmacia'>('lembretes');

  // --- ESTADOS DA ABA DE ALARMES ---
  const [lembretes, setLembretes] = useState<LembreteApp[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'remedio' | 'acao'>('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<'remedio' | 'acao'>('remedio');

  // Formulário Lembrete - Remédio
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [horarioRemedio, setHorarioRemedio] = useState('');
  const [frequenciaRemedio, setFrequenciaRemedio] = useState('');
  const [observacoesRemedio, setObservacoesRemedio] = useState('');

  // Formulário Lembrete - Ação
  const [tipoAcao, setTipoAcao] = useState<'consulta' | 'exercicio' | 'agua' | 'pressao' | 'outro'>('agua');
  const [acaoPersonalizada, setAcaoPersonalizada] = useState('');
  const [horarioAcao, setHorarioAcao] = useState('');

  // --- ESTADOS DA ABA DE ESTOQUE MÉDICO ---
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medModalVisible, setMedModalVisible] = useState(false);
  const [nomeMed, setNomeMed] = useState('');
  const [dosagemMed, setDosagemMed] = useState('');
  const [formaMed, setFormaMed] = useState('');
  const [estoqueMed, setEstoqueMed] = useState('');

  // Inicialização
  useEffect(() => {
    carregarLembretes();
    carregarMedicamentos();
    solicitarPermissoesNotificacao();
  }, []);

  // Permissões para notificações locais
  const solicitarPermissoesNotificacao = async () => {
    try {
      const { status: statusExistente } = await Notifications.getPermissionsAsync();
      let statusFinal = statusExistente;
      if (statusExistente !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        statusFinal = status;
      }
      if (statusFinal !== 'granted') {
        Alert.alert('Aviso', 'O aplicativo não possui permissão para disparar alertas sonoros.');
      }
    } catch (error) {
      console.log('Erro de permissão de notificações:', error);
    }
  };

  // --- CARREGAMENTO E PERSISTÊNCIA ---
  const carregarLembretes = async () => {
    try {
      const valor = await AsyncStorage.getItem(LEMBRETES_KEY);
      if (valor !== null) setLembretes(JSON.parse(valor));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os lembretes.');
    }
  };

  const salvarLembretes = async (novosLembretes: LembreteApp[]) => {
    try {
      await AsyncStorage.setItem(LEMBRETES_KEY, JSON.stringify(novosLembretes));
      setLembretes(novosLembretes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os lembretes.');
    }
  };

  const carregarMedicamentos = async () => {
    try {
      const valor = await AsyncStorage.getItem(MEDICAMENTOS_KEY);
      if (valor !== null) setMedicamentos(JSON.parse(valor));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o estoque de medicamentos.');
    }
  };

  const salvarMedicamentos = async (novosMed: Medicamento[]) => {
    try {
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(novosMed));
      setMedicamentos(novosMed);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações no estoque.');
    }
  };

  // --- FUNÇÕES DE ALARMES/NOTIFICAÇÕES ---
  const agendarNotificacaoLembrete = async (
    tipo: 'remedio' | 'acao',
    dados: {
      nomeRemedio?: string;
      frequencia?: string;
      tipoAcao?: string;
      acaoPersonalizada?: string;
      horario: string;
    }
  ): Promise<string | undefined> => {
    try {
      const [hourStr, minuteStr] = dados.horario.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      let titulo = '';
      let corpo = '';

      if (tipo === 'remedio') {
        titulo = `💊 Hora do Remédio: ${dados.nomeRemedio}`;
        corpo = `Frequência: ${dados.frequencia}`;
      } else {
        let textoAcao = '';
        switch (dados.tipoAcao) {
          case 'consulta': textoAcao = 'Ida a consultas 🩺'; break;
          case 'exercicio': textoAcao = 'Fazer exercícios 🏃‍♂️'; break;
          case 'agua': textoAcao = 'Beber água 💧'; break;
          case 'pressao': textoAcao = 'Medir pressão ❤️'; break;
          case 'outro': textoAcao = dados.acaoPersonalizada || 'Ação de Saúde 📝'; break;
          default: textoAcao = 'Ação de Saúde ⚡';
        }
        titulo = `⚡ Lembrete de Ação: ${textoAcao}`;
        corpo = `Está no horário do seu lembrete diário de saúde.`;
      }

      const idNotificacao = await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: corpo,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hour,
          minute: minute,
        },
      });

      return idNotificacao;
    } catch (error) {
      console.log('Erro ao agendar a notificação:', error);
      return undefined;
    }
  };

  const cancelarNotificacaoLembrete = async (notificationId?: string) => {
    if (!notificationId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Erro ao cancelar a notificação agendada:', error);
    }
  };

  // Limpa campos de inserção de lembrete
  const limparCamposFormLembrete = () => {
    setNomeRemedio('');
    setHorarioRemedio('');
    setFrequenciaRemedio('');
    setObservacoesRemedio('');
    setTipoAcao('agua');
    setAcaoPersonalizada('');
    setHorarioAcao('');
  };

  // Salva novo lembrete
  const handleAdicionarLembrete = async () => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (categoriaSelecionada === 'remedio') {
      if (!nomeRemedio.trim()) {
        Alert.alert('Atenção', 'Digite o nome do remédio.');
        return;
      }
      if (!horarioRemedio.trim() || !timeRegex.test(horarioRemedio.trim())) {
        Alert.alert('Atenção', 'Insira um horário válido no formato HH:MM (ex: 08:30).');
        return;
      }
      if (!frequenciaRemedio.trim()) {
        Alert.alert('Atenção', 'Defina a frequência.');
        return;
      }

      const notifId = await agendarNotificacaoLembrete('remedio', {
        nomeRemedio: nomeRemedio.trim(),
        frequencia: frequenciaRemedio.trim(),
        horario: horarioRemedio.trim(),
      });

      const novoRemedio: LembreteRemedio = {
        id: Math.random().toString(36).substring(2, 9),
        tipo: 'remedio',
        concluido: false,
        nomeRemedio: nomeRemedio.trim(),
        horario: horarioRemedio.trim(),
        frequencia: frequenciaRemedio.trim(),
        observacoes: observacoesRemedio.trim() || undefined,
        notificationId: notifId,
      };

      const listaAtualizada = [...lembretes, novoRemedio];
      salvarLembretes(listaAtualizada);

    } else {
      if (tipoAcao === 'outro' && !acaoPersonalizada.trim()) {
        Alert.alert('Atenção', 'Descreva qual ação você deseja lembrar.');
        return;
      }
      if (!horarioAcao.trim() || !timeRegex.test(horarioAcao.trim())) {
        Alert.alert('Atenção', 'Insira um horário válido no formato HH:MM (ex: 15:00).');
        return;
      }

      const notifId = await agendarNotificacaoLembrete('acao', {
        tipoAcao: tipoAcao,
        acaoPersonalizada: acaoPersonalizada.trim(),
        horario: horarioAcao.trim(),
      });

      const novoAcao: LembreteAcao = {
        id: Math.random().toString(36).substring(2, 9),
        tipo: 'acao',
        concluido: false,
        tipoAcao: tipoAcao,
        acaoPersonalizada: tipoAcao === 'outro' ? acaoPersonalizada.trim() : undefined,
        horario: horarioAcao.trim(),
        notificationId: notifId,
      };

      const listaAtualizada = [...lembretes, novoAcao];
      salvarLembretes(listaAtualizada);
    }

    setModalVisible(false);
    limparCamposFormLembrete();
    Alert.alert('Sucesso', 'Lembrete cadastrado e alarme programado!');
  };

  const handleAlternarConcluido = (id: string) => {
    const listaAtualizada = lembretes.map((item) => {
      if (item.id === id) return { ...item, concluido: !item.concluido };
      return item;
    });
    salvarLembretes(listaAtualizada);
  };

  const handleExcluirLembrete = (id: string, notificationId?: string) => {
    Alert.alert(
      'Excluir Lembrete',
      'Deseja excluir este lembrete? O alarme associado também será cancelado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          style: 'destructive', 
          onPress: async () => {
            await cancelarNotificacaoLembrete(notificationId);
            const listaAtualizada = lembretes.filter((item) => item.id !== id);
            salvarLembretes(listaAtualizada);
          } 
        }
      ]
    );
  };

  // --- GERENCIAMENTO DE ESTOQUE (FARMÁCIA) ---
  const handleSaveMed = () => {
    if (!nomeMed.trim() || !dosagemMed.trim()) {
      Alert.alert('Erro', 'Nome e dosagem são obrigatórios.');
      return;
    }

    if (nomeMed.toLowerCase().includes('aspirina') || nomeMed.toLowerCase() === 'aas') {
      Alert.alert('Atenção: Interação', 'Aspirina/AAS pode ter interação medicamentosa grave se combinada com anticoagulantes!');
    }

    const novoMed: Medicamento = {
      id: Math.random().toString(36).substring(2, 9),
      nome: nomeMed.trim(),
      dosagem: dosagemMed.trim(),
      forma: formaMed.trim() || 'Comprimido',
      estoque: estoqueMed.trim() || '0',
    };

    const listaAtualizada = [...medicamentos, novoMed];
    salvarMedicamentos(listaAtualizada);

    setMedModalVisible(false);
    setNomeMed('');
    setDosagemMed('');
    setFormaMed('');
    setEstoqueMed('');
    Alert.alert('Sucesso', 'Medicamento adicionado ao estoque!');
  };

  const handleDeleteMed = (id: string) => {
    Alert.alert(
      'Excluir do Estoque',
      'Deseja remover este medicamento da sua lista de estoque?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive', 
          onPress: () => {
            const listaAtualizada = medicamentos.filter((item) => item.id !== id);
            salvarMedicamentos(listaAtualizada);
          } 
        }
      ]
    );
  };

  // Geração de PDF do Estoque Médico
  const handleGeneratePDF = async () => {
    if (medicamentos.length === 0) {
      Alert.alert('Atenção', 'Você não possui medicamentos em estoque para gerar o relatório.');
      return;
    }

    const rows = medicamentos.map(med => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.nome}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.dosagem}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.forma}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${med.estoque}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { color: #0056b3; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #0056b3; color: white; padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Relatório de Medicamentos em Estoque</h1>
          <p>Gerado pelo aplicativo <strong>MeuAppDeSaude</strong></p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Dosagem</th>
                <th>Formato</th>
                <th>Estoque</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Aviso', 'O menu de compartilhamento não está disponível no emulador.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar e exportar o relatório em PDF.');
    }
  };

  // --- MAPEAMENTOS E AUXILIARES ---
  const obterTextoAcao = (item: LembreteAcao) => {
    switch (item.tipoAcao) {
      case 'consulta': return 'Ida a consultas 🩺';
      case 'exercicio': return 'Fazer exercícios 🏃‍♂️';
      case 'agua': return 'Beber água 💧';
      case 'pressao': return 'Medir pressão ❤️';
      case 'outro': return item.acaoPersonalizada || 'Outro Lembrete';
      default: return 'Ação de Saúde';
    }
  };

  const lembretesFiltrados = lembretes.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipo === filtro;
  });

  // --- RENDERIZADORES ---
  const renderItemLembrete = ({ item }: { item: LembreteApp }) => {
    const isRemedio = item.tipo === 'remedio';
    return (
      <View style={[
        styles.card, 
        isRemedio ? styles.remedioCard : styles.acaoCard,
        item.concluido && styles.completedCard
      ]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, item.concluido && styles.completedText]}>
              {isRemedio ? (item as LembreteRemedio).nomeRemedio : obterTextoAcao(item as LembreteAcao)}
            </Text>
            <View style={[styles.cardBadge, isRemedio ? styles.remedioBadge : styles.acaoBadge]}>
              <Text style={[styles.badgeText, isRemedio ? styles.remedioBadgeText : styles.acaoBadgeText]}>
                {isRemedio ? '💊 Remédio' : '⚡ Ação'}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, item.concluido && styles.completedText]}>
            ⏰ Horário: <Text style={{ fontWeight: 'bold' }}>{item.horario}</Text>
          </Text>
          {isRemedio && (
            <Text style={[styles.cardSubtitle, item.concluido && styles.completedText]}>
              🔄 Frequência: {(item as LembreteRemedio).frequencia}
            </Text>
          )}
          {isRemedio && (item as LembreteRemedio).observacoes && (
            <Text style={[styles.cardNotes, item.concluido && { opacity: 0.5 }]}>
              📝 Obs: {(item as LembreteRemedio).observacoes}
            </Text>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, item.concluido && styles.checkButtonActive]} 
            onPress={() => handleAlternarConcluido(item.id)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>{item.concluido ? '✅' : '⬜'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleExcluirLembrete(item.id, item.notificationId)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Lembretes & Farmácia</Text>
        <Text style={styles.subtitle}>Gerencie suas rotinas cotidianas de saúde.</Text>
      </View>

      {/* Abas Principais (Alarmes vs Estoque Médico) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lembretes' && styles.tabActive]} 
          onPress={() => setActiveTab('lembretes')}
        >
          <Text style={[styles.tabText, activeTab === 'lembretes' && styles.tabTextActive]}>⏰ Alarmes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'farmacia' && styles.tabActive]} 
          onPress={() => setActiveTab('farmacia')}
        >
          <Text style={[styles.tabText, activeTab === 'farmacia' && styles.tabTextActive]}>📦 Estoque</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo dependente da aba ativa */}
      {activeTab === 'lembretes' ? (
        <>
          {/* Sub-filtros para Lembretes */}
          <View style={styles.filterRow}>
            <TouchableOpacity 
              style={[styles.filterTab, filtro === 'todos' && styles.filterTabActive]}
              onPress={() => setFiltro('todos')}
            >
              <Text style={[styles.filterTabText, filtro === 'todos' && styles.filterTabTextActive]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, filtro === 'remedio' && styles.filterTabActive]}
              onPress={() => setFiltro('remedio')}
            >
              <Text style={[styles.filterTabText, filtro === 'remedio' && styles.filterTabTextActive]}>💊 Remédios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, filtro === 'acao' && styles.filterTabActive]}
              onPress={() => setFiltro('acao')}
            >
              <Text style={[styles.filterTabText, filtro === 'acao' && styles.filterTabTextActive]}>⚡ Ações</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.newButton} 
            activeOpacity={0.8} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.newButtonText}>+ Novo Lembrete</Text>
          </TouchableOpacity>

          {/* Lista de Alarmes */}
          <FlatList
            data={lembretesFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderItemLembrete}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 36 }}>📋</Text>
                <Text style={styles.emptyText}>Nenhum lembrete nesta categoria.</Text>
              </View>
            }
          />
        </>
      ) : (
        <>
          {/* Botões do Estoque */}
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.pdfButton} activeOpacity={0.8} onPress={handleGeneratePDF}>
              <Text style={styles.buttonText}>Gerar PDF 📄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addMedButton} activeOpacity={0.8} onPress={() => setMedModalVisible(true)}>
              <Text style={styles.buttonText}>+ Medicamento</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Medicamentos em Estoque */}
          <FlatList
            data={medicamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.medCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medTitle}>{item.nome}</Text>
                  <Text style={styles.medSub}>{item.dosagem} - {item.forma}</Text>
                </View>
                <View style={styles.medEstoqueBadge}>
                  <Text style={styles.medEstoqueText}>Qtd: {item.estoque}</Text>
                </View>
                <TouchableOpacity style={styles.medDeleteButton} onPress={() => handleDeleteMed(item.id)}>
                  <Text style={{ fontSize: 16 }}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 36 }}>📦</Text>
                <Text style={styles.emptyText}>Nenhum medicamento em estoque.</Text>
              </View>
            }
          />
        </>
      )}

      {/* Botão de Navegação para Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Voltar ao Painel</Text>
      </TouchableOpacity>

      {/* MODAL NOVO ALARME (LEMBRETE) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          limparCamposFormLembrete();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Novo Lembrete</Text>

            <View style={styles.categorySelector}>
              <TouchableOpacity 
                style={[
                  styles.categoryTab, 
                  categoriaSelecionada === 'remedio' && styles.categoryTabActiveRemedio || {}
                ]}
                onPress={() => setCategoriaSelecionada('remedio')}
              >
                <Text style={[
                  styles.categoryTabText, 
                  categoriaSelecionada === 'remedio' && styles.categoryTabTextActive || {}
                ]}>💊 Remédio</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.categoryTab, 
                  categoriaSelecionada === 'acao' && styles.categoryTabActiveAcao || {}
                ]}
                onPress={() => setCategoriaSelecionada('acao')}
              >
                <Text style={[
                  styles.categoryTabText, 
                  categoriaSelecionada === 'acao' && styles.categoryTabTextActive || {}
                ]}>⚡ Ação</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.formScroll} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {categoriaSelecionada === 'remedio' ? (
                <View>
                  <Text style={styles.label}>Nome do Remédio *</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: Paracetamol, Losartana"
                    placeholderTextColor="#999"
                    value={nomeRemedio}
                    onChangeText={setNomeRemedio}
                  />

                  <Text style={styles.label}>Horário *</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: 08:00, 22:30"
                    placeholderTextColor="#999"
                    value={horarioRemedio}
                    onChangeText={setHorarioRemedio}
                    keyboardType="numbers-and-punctuation"
                  />

                  <Text style={styles.label}>Frequência *</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: A cada 8 horas, Uma vez ao dia"
                    placeholderTextColor="#999"
                    value={frequenciaRemedio}
                    onChangeText={setFrequenciaRemedio}
                  />

                  <Text style={styles.label}>Observações Opcionais</Text>
                  <TextInput 
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Ex: Tomar após o almoço"
                    placeholderTextColor="#999"
                    value={observacoesRemedio}
                    onChangeText={setObservacoesRemedio}
                    multiline={true}
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.label}>Tipo de Ação *</Text>
                  <View style={styles.selectRow}>
                    {(['consulta', 'exercicio', 'agua', 'pressao', 'outro'] as const).map((item) => {
                      const label = 
                        item === 'consulta' ? 'Ida a consultas 🩺' :
                        item === 'exercicio' ? 'Fazer exercícios 🏃‍♂️' :
                        item === 'agua' ? 'Beber água 💧' :
                        item === 'pressao' ? 'Medir pressão ❤️' : 'Outros 📝';
                      
                      return (
                        <TouchableOpacity
                          key={item}
                          style={[styles.selectItem, tipoAcao === item && styles.selectItemActive]}
                          onPress={() => setTipoAcao(item)}
                        >
                          <Text style={[styles.selectItemText, tipoAcao === item && styles.selectItemTextActive]}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {tipoAcao === 'outro' && (
                    <View>
                      <Text style={styles.label}>Descreva a Ação *</Text>
                      <TextInput 
                        style={styles.input}
                        placeholder="Ex: Tomar banho de sol"
                        placeholderTextColor="#999"
                        value={acaoPersonalizada}
                        onChangeText={setAcaoPersonalizada}
                      />
                    </View>
                  )}

                  <Text style={styles.label}>Horário *</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: 14:00, 19:30"
                    placeholderTextColor="#999"
                    value={horarioAcao}
                    onChangeText={setHorarioAcao}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.btnCancelar}
                onPress={() => {
                  setModalVisible(false);
                  limparCamposFormLembrete();
                }}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.btnSalvar, 
                  categoriaSelecionada === 'remedio' ? styles.btnSalvarRemedio : styles.btnSalvarAcao
                ]}
                onPress={handleAdicionarLembrete}
              >
                <Text style={styles.btnSalvarText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL NOVO MEDICAMENTO (ESTOQUE) */}
      <Modal
        visible={medModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Novo Medicamento</Text>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Nome do Medicamento *</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ex: Losartana, Metformina"
                placeholderTextColor="#999"
                value={nomeMed}
                onChangeText={setNomeMed}
              />

              <Text style={styles.label}>Dosagem *</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ex: 50mg, 5ml"
                placeholderTextColor="#999"
                value={dosagemMed}
                onChangeText={setDosagemMed}
              />

              <Text style={styles.label}>Forma Farmacêutica</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ex: Comprimido, Xarope, Gotas"
                placeholderTextColor="#999"
                value={formaMed}
                onChangeText={setFormaMed}
              />

              <Text style={styles.label}>Quantidade em Estoque</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ex: 30, 60"
                placeholderTextColor="#999"
                value={estoqueMed}
                onChangeText={setEstoqueMed}
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.btnCancelar}
                onPress={() => {
                  setMedModalVisible(false);
                  setNomeMed(''); setDosagemMed(''); setFormaMed(''); setEstoqueMed('');
                }}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btnSalvar, { backgroundColor: '#28A745' }]}
                onPress={handleSaveMed}
              >
                <Text style={styles.btnSalvarText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
