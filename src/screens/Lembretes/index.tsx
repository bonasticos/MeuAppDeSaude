import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { Lembrete, LembreteAcao, LembreteRemedio, Medicamento } from '../../types';
import { styles } from './styles';

export type { Lembrete, LembreteRemedio, LembreteAcao, Medicamento };

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

type RemindersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lembretes'>;

interface Props {
  navigation: RemindersScreenNavigationProp;
}

// Chaves legadas usadas apenas para migração única rumo ao useStore
const LEGACY_LEMBRETES_KEY = '@lembretes_saude_v4';
const LEGACY_MEDICAMENTOS_KEY = '@medicamentos_saude_v4';

const ARMAZENAMENTO_OPCOES = [
  'Temperatura ambiente',
  'Local seco e arejado',
  'Geladeira (2–8 °C)',
  'Proteger da luz',
];

const FORMA_OPCOES = ['Comprimido', 'Cápsula', 'Gotas', 'Xarope', 'Pomada'];

const normalizeNome = (valor: string) =>
  valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const avaliarValidade = (validade?: string): 'vencido' | 'proximo' | 'ok' | null => {
  if (!validade || !validade.trim()) return null;
  const clean = validade.trim();
  const partes = clean.split(/[/-]/);
  let expiryDate: Date | null = null;

  if (partes.length === 2) {
    const mes = parseInt(partes[0], 10);
    const anoRaw = parseInt(partes[1], 10);
    const ano = anoRaw < 100 ? 2000 + anoRaw : anoRaw;
    if (!isNaN(mes) && !isNaN(ano) && mes >= 1 && mes <= 12) {
      expiryDate = new Date(ano, mes, 0, 23, 59, 59);
    }
  } else if (partes.length === 3) {
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const anoRaw = parseInt(partes[2], 10);
    const ano = anoRaw < 100 ? 2000 + anoRaw : anoRaw;
    if (!isNaN(dia) && !isNaN(mes) && !isNaN(ano) && mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31) {
      expiryDate = new Date(ano, mes - 1, dia, 23, 59, 59);
    }
  }

  if (!expiryDate || isNaN(expiryDate.getTime())) return null;

  const hoje = new Date();
  const diffDias = (expiryDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDias < 0) return 'vencido';
  if (diffDias <= 30) return 'proximo';
  return 'ok';
};

export default function TelaLembretes({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'lembretes' | 'farmacia'>('lembretes');

  // Estado global unificado no Zustand (RF14, RF16, RF17, RF18, RF20)
  const lembretes = useStore((state) => state.lembretes || []);
  const addLembrete = useStore((state) => state.addLembrete);
  const updateLembrete = useStore((state) => state.updateLembrete);
  const removeLembrete = useStore((state) => state.removeLembrete);
  const setLembretes = useStore((state) => state.setLembretes);

  const medicamentos = useStore((state) => state.medicamentos || []);
  const addMedicamento = useStore((state) => state.addMedicamento);
  const updateMedicamento = useStore((state) => state.updateMedicamento);
  const removeMedicamento = useStore((state) => state.removeMedicamento);
  const setMedicamentos = useStore((state) => state.setMedicamentos);

  // --- ESTADOS DA ABA DE ALARMES ---
  const [filtro, setFiltro] = useState<'todos' | 'remedio' | 'acao'>('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLembreteId, setEditingLembreteId] = useState<string | null>(null);
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

  // --- ESTADOS DA ABA DE ESTOQUE MÉDICO (FARMÁCIA) ---
  const [medModalVisible, setMedModalVisible] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [nomeMed, setNomeMed] = useState('');
  const [dosagemMed, setDosagemMed] = useState('');
  const [formaMed, setFormaMed] = useState('');
  const [estoqueMed, setEstoqueMed] = useState('');
  const [prescritorMed, setPrescritorMed] = useState('');
  const [validadeMed, setValidadeMed] = useState('');
  const [armazenamentoMed, setArmazenamentoMed] = useState('');

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const confirmarAcao = (
    titulo: string,
    mensagem: string,
    textoConfirmar: string,
    onConfirm: () => void | Promise<void>
  ) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`${titulo}\n\n${mensagem}`)) {
        onConfirm();
      }
      return;
    }

    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: textoConfirmar, style: 'destructive', onPress: () => void onConfirm() },
    ]);
  };

  // Migração única de AsyncStorage isolado legado para o useStore + Permissões
  useEffect(() => {
    const migrarDadosLegados = async () => {
      try {
        const [legacyLembRaw, legacyMedsRaw] = await Promise.all([
          AsyncStorage.getItem(LEGACY_LEMBRETES_KEY),
          AsyncStorage.getItem(LEGACY_MEDICAMENTOS_KEY),
        ]);

        if (legacyLembRaw) {
          const parsed = JSON.parse(legacyLembRaw);
          const estadoAtual = useStore.getState().lembretes || [];
          if (Array.isArray(parsed) && parsed.length > 0 && estadoAtual.length === 0) {
            const validos = parsed.filter(
              (item: any) => item && (item.tipo === 'remedio' || item.tipo === 'acao')
            ) as Lembrete[];
            if (validos.length > 0) {
              setLembretes(validos);
            }
          }
          await AsyncStorage.removeItem(LEGACY_LEMBRETES_KEY);
        }

        if (legacyMedsRaw) {
          const parsed = JSON.parse(legacyMedsRaw);
          const medsAtuais = useStore.getState().medicamentos || [];
          if (Array.isArray(parsed) && parsed.length > 0 && medsAtuais.length === 0) {
            const validos = parsed.filter((item: any) => item && item.nome) as Medicamento[];
            if (validos.length > 0) {
              setMedicamentos(validos);
            }
          }
          await AsyncStorage.removeItem(LEGACY_MEDICAMENTOS_KEY);
        }
      } catch (error) {
        console.log('Erro ao migrar dados legados para useStore:', error);
      }
    };

    let unsubHydration: (() => void) | undefined;
    if (useStore.persist?.hasHydrated?.()) {
      void migrarDadosLegados();
    } else if (useStore.persist?.onFinishHydration) {
      unsubHydration = useStore.persist.onFinishHydration(() => {
        void migrarDadosLegados();
      });
    } else {
      void migrarDadosLegados();
    }

    solicitarPermissoesNotificacao();

    return () => {
      if (unsubHydration) unsubHydration();
    };
  }, []);

  const solicitarPermissoesNotificacao = async () => {
    if (Platform.OS === 'web') return;
    try {
      const { status: statusExistente } = await Notifications.getPermissionsAsync();
      let statusFinal = statusExistente;
      if (statusExistente !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        statusFinal = status;
      }
      if (statusFinal !== 'granted') {
        mostrarAlerta('Aviso', 'O aplicativo não possui permissão para disparar alertas sonoros.');
      }
    } catch (error) {
      console.log('Erro de permissão de notificações:', error);
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
    if (Platform.OS === 'web') return undefined;
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
          case 'consulta':
            textoAcao = 'Ida a consultas 🩺';
            break;
          case 'exercicio':
            textoAcao = 'Fazer exercícios 🏃‍♂️';
            break;
          case 'agua':
            textoAcao = 'Beber água 💧';
            break;
          case 'pressao':
            textoAcao = 'Medir pressão ❤️';
            break;
          case 'outro':
            textoAcao = dados.acaoPersonalizada || 'Ação de Saúde 📝';
            break;
          default:
            textoAcao = 'Ação de Saúde ⚡';
        }
        titulo = `⚡ Lembrete de Ação: ${textoAcao}`;
        corpo = 'Está no horário do seu lembrete diário de saúde.';
      }

      const idNotificacao = await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: corpo,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      return idNotificacao;
    } catch (error) {
      console.log('Erro ao agendar a notificação:', error);
      return undefined;
    }
  };

  const cancelarNotificacaoLembrete = async (notificationId?: string) => {
    if (!notificationId || Platform.OS === 'web') return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Erro ao cancelar a notificação agendada:', error);
    }
  };

  const limparCamposFormLembrete = () => {
    setEditingLembreteId(null);
    setCategoriaSelecionada('remedio');
    setNomeRemedio('');
    setHorarioRemedio('');
    setFrequenciaRemedio('');
    setObservacoesRemedio('');
    setTipoAcao('agua');
    setAcaoPersonalizada('');
    setHorarioAcao('');
  };

  const handleAbrirNovoLembrete = () => {
    limparCamposFormLembrete();
    setModalVisible(true);
  };

  const handleAbrirEditarLembrete = (item: Lembrete) => {
    limparCamposFormLembrete();
    setEditingLembreteId(item.id);
    setCategoriaSelecionada(item.tipo);

    if (item.tipo === 'remedio') {
      setNomeRemedio(item.nomeRemedio);
      setHorarioRemedio(item.horario);
      setFrequenciaRemedio(item.frequencia);
      setObservacoesRemedio(item.observacoes || '');
    } else {
      setTipoAcao(item.tipoAcao);
      setAcaoPersonalizada(item.acaoPersonalizada || '');
      setHorarioAcao(item.horario);
    }
    setModalVisible(true);
  };

  // Salva novo lembrete OU atualiza lembrete existente (RF14)
  const handleSalvarLembrete = async () => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (categoriaSelecionada === 'remedio') {
      if (!nomeRemedio.trim()) {
        mostrarAlerta('Atenção', 'Digite o nome do remédio.');
        return;
      }
      if (!horarioRemedio.trim() || !timeRegex.test(horarioRemedio.trim())) {
        mostrarAlerta('Atenção', 'Insira um horário válido no formato HH:MM (ex: 08:30).');
        return;
      }
      if (!frequenciaRemedio.trim()) {
        mostrarAlerta('Atenção', 'Defina a frequência.');
        return;
      }

      if (editingLembreteId) {
        const existente = lembretes.find((l) => l.id === editingLembreteId);
        await cancelarNotificacaoLembrete(existente?.notificationId);
      }

      const notifId = await agendarNotificacaoLembrete('remedio', {
        nomeRemedio: nomeRemedio.trim(),
        frequencia: frequenciaRemedio.trim(),
        horario: horarioRemedio.trim(),
      });

      if (editingLembreteId) {
        updateLembrete(editingLembreteId, {
          nomeRemedio: nomeRemedio.trim(),
          horario: horarioRemedio.trim(),
          frequencia: frequenciaRemedio.trim(),
          observacoes: observacoesRemedio.trim() || undefined,
          notificationId: notifId,
        });
      } else {
        addLembrete({
          tipo: 'remedio',
          concluido: false,
          nomeRemedio: nomeRemedio.trim(),
          horario: horarioRemedio.trim(),
          frequencia: frequenciaRemedio.trim(),
          observacoes: observacoesRemedio.trim() || undefined,
          notificationId: notifId,
        });
      }
    } else {
      if (tipoAcao === 'outro' && !acaoPersonalizada.trim()) {
        mostrarAlerta('Atenção', 'Descreva qual ação você deseja lembrar.');
        return;
      }
      if (!horarioAcao.trim() || !timeRegex.test(horarioAcao.trim())) {
        mostrarAlerta('Atenção', 'Insira um horário válido no formato HH:MM (ex: 15:00).');
        return;
      }

      if (editingLembreteId) {
        const existente = lembretes.find((l) => l.id === editingLembreteId);
        await cancelarNotificacaoLembrete(existente?.notificationId);
      }

      const notifId = await agendarNotificacaoLembrete('acao', {
        tipoAcao,
        acaoPersonalizada: acaoPersonalizada.trim(),
        horario: horarioAcao.trim(),
      });

      if (editingLembreteId) {
        updateLembrete(editingLembreteId, {
          tipoAcao,
          acaoPersonalizada: tipoAcao === 'outro' ? acaoPersonalizada.trim() : undefined,
          horario: horarioAcao.trim(),
          notificationId: notifId,
        });
      } else {
        addLembrete({
          tipo: 'acao',
          concluido: false,
          tipoAcao,
          acaoPersonalizada: tipoAcao === 'outro' ? acaoPersonalizada.trim() : undefined,
          horario: horarioAcao.trim(),
          notificationId: notifId,
        });
      }
    }

    const estavaEditando = Boolean(editingLembreteId);
    setModalVisible(false);
    limparCamposFormLembrete();
    mostrarAlerta(
      'Sucesso',
      estavaEditando
        ? 'Lembrete e alarme atualizados com sucesso!'
        : 'Lembrete cadastrado e alarme programado!'
    );
  };

  // Marca como concluído e realiza baixa automática no estoque quando é remédio (RF18)
  const handleAlternarConcluido = (item: Lembrete) => {
    const proximoStatus = !item.concluido;
    updateLembrete(item.id, { concluido: proximoStatus });

    if (proximoStatus && item.tipo === 'remedio') {
      const remNorm = normalizeNome(item.nomeRemedio);
      const ativos = medicamentos.filter((m) => !m.descontinuado);

      let medCorrespondente = ativos.find((m) => normalizeNome(m.nome) === remNorm);
      if (!medCorrespondente && remNorm.length >= 3) {
        medCorrespondente = ativos.find((m) => {
          const medNorm = normalizeNome(m.nome);
          return medNorm.includes(remNorm) || remNorm.includes(medNorm);
        });
      }

      if (medCorrespondente) {
        const estoqueAtual = parseInt(medCorrespondente.estoque || '0', 10);
        const qtdValida = isNaN(estoqueAtual) ? 0 : estoqueAtual;

        if (qtdValida > 0) {
          const novoEstoque = qtdValida - 1;
          updateMedicamento(medCorrespondente.id, { estoque: String(novoEstoque) });

          if (novoEstoque <= 5) {
            mostrarAlerta(
              '⚠️ Estoque Baixo!',
              `Dose de "${medCorrespondente.nome}" registrada (-1 unidade no estoque).\nRestam apenas ${novoEstoque} unidade(s) — providencie reposição!`
            );
          } else {
            mostrarAlerta(
              '💊 Dose Confirmada',
              `1 unidade de "${medCorrespondente.nome}" descontada do estoque.\nEstoque atual: ${novoEstoque} unidade(s).`
            );
          }
        } else {
          mostrarAlerta(
            '⚠️ Estoque Zerado!',
            `Lembrete concluído, porém "${medCorrespondente.nome}" já está com 0 unidades em estoque.`
          );
        }
      }
    }
  };

  const handleExcluirLembrete = (id: string, notificationId?: string) => {
    confirmarAcao(
      'Excluir Lembrete',
      'Deseja excluir este lembrete? O alarme associado também será cancelado.',
      'Confirmar',
      async () => {
        await cancelarNotificacaoLembrete(notificationId);
        removeLembrete(id);
      }
    );
  };

  // --- GERENCIAMENTO DE ESTOQUE (FARMÁCIA - RF15, RF17, RF19, RF20) ---
  const limparCamposMed = () => {
    setEditingMedId(null);
    setNomeMed('');
    setDosagemMed('');
    setFormaMed('');
    setEstoqueMed('');
    setPrescritorMed('');
    setValidadeMed('');
    setArmazenamentoMed('');
  };

  const handleAbrirNovoMed = () => {
    limparCamposMed();
    setMedModalVisible(true);
  };

  const handleAbrirEditarMed = (med: Medicamento) => {
    setEditingMedId(med.id);
    setNomeMed(med.nome);
    setDosagemMed(med.dosagem);
    setFormaMed(med.forma || '');
    setEstoqueMed(med.estoque || '0');
    setPrescritorMed(med.prescritor || '');
    setValidadeMed(med.validade || '');
    setArmazenamentoMed(med.armazenamento || '');
    setMedModalVisible(true);
  };

  const handleSaveMed = () => {
    if (!nomeMed.trim() || !dosagemMed.trim()) {
      mostrarAlerta('Erro', 'Nome e dosagem são obrigatórios.');
      return;
    }

    const nomeLower = nomeMed.toLowerCase();
    if (nomeLower.includes('aspirina') || nomeLower.trim() === 'aas') {
      mostrarAlerta(
        'Atenção: Interação',
        'Aspirina/AAS pode ter interação medicamentosa grave se combinada com anticoagulantes!'
      );
    }

    const dadosMed = {
      nome: nomeMed.trim(),
      dosagem: dosagemMed.trim(),
      forma: formaMed.trim() || 'Comprimido',
      estoque: estoqueMed.replace(/[^\d]/g, '') || '0',
      prescritor: prescritorMed.trim() || undefined,
      validade: validadeMed.trim() || undefined,
      armazenamento: armazenamentoMed.trim() || undefined,
    };

    if (editingMedId) {
      updateMedicamento(editingMedId, dadosMed);
    } else {
      addMedicamento({
        ...dadosMed,
        descontinuado: false,
        dataInicio: new Date().toISOString(),
      });
    }

    const estavaEditando = Boolean(editingMedId);
    setMedModalVisible(false);
    limparCamposMed();
    mostrarAlerta(
      'Sucesso',
      estavaEditando ? 'Medicamento atualizado no estoque!' : 'Medicamento adicionado ao estoque!'
    );
  };

  const handleToggleDescontinuarMed = (med: Medicamento) => {
    if (med.descontinuado) {
      updateMedicamento(med.id, {
        descontinuado: false,
        dataTermino: undefined,
      });
      mostrarAlerta('Reativado', `"${med.nome}" voltou para seu estoque de medicamentos ativos.`);
      return;
    }

    confirmarAcao(
      'Descontinuar Medicamento',
      `Deseja mover "${med.nome}" para o Histórico de Medicamentos Descontinuados?`,
      'Descontinuar',
      () => {
        updateMedicamento(med.id, {
          descontinuado: true,
          dataTermino: new Date().toISOString(),
        });
      }
    );
  };

  const handleDeleteMed = (id: string) => {
    confirmarAcao(
      'Excluir do Estoque',
      'Deseja remover este medicamento definitivamente da lista?',
      'Remover',
      () => {
        removeMedicamento(id);
      }
    );
  };

  // Geração de PDF do Estoque Médico
  const handleGeneratePDF = async () => {
    if (medicamentos.length === 0) {
      mostrarAlerta('Atenção', 'Você não possui medicamentos em estoque para gerar o relatório.');
      return;
    }

    const rows = medicamentos
      .map((med) => {
        const qtd = parseInt(med.estoque || '0', 10) || 0;
        const statusTxt = med.descontinuado
          ? `Descontinuado${med.dataTermino ? ` (${new Date(med.dataTermino).toLocaleDateString('pt-BR')})` : ''}`
          : qtd <= 5
            ? 'Ativo (Estoque Baixo!)'
            : 'Ativo';
        return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.nome}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.dosagem} (${med.forma})</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${med.estoque}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.prescritor || '—'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.validade || '—'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${med.armazenamento || '—'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${statusTxt}</td>
      </tr>
    `;
      })
      .join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1F2937; }
            h1 { color: #0056b3; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #0056b3; color: white; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Relatório de Medicamentos em Estoque</h1>
          <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} pelo aplicativo <strong>MeuAppDeSaude (UNC)</strong></p>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Dosagem / Forma</th>
                <th>Qtd</th>
                <th>Prescritor</th>
                <th>Validade</th>
                <th>Armazenamento</th>
                <th>Situação</th>
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
      if (Platform.OS === 'web') {
        await Print.printAsync({ html });
        return;
      }
      const { uri } = await Print.printToFileAsync({ html });
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        await Print.printAsync({ html });
      }
    } catch (error) {
      mostrarAlerta('Erro', 'Não foi possível gerar e exportar o relatório em PDF.');
    }
  };

  // --- MAPEAMENTOS E AUXILIARES ---
  const obterTextoAcao = (item: LembreteAcao) => {
    switch (item.tipoAcao) {
      case 'consulta':
        return 'Ida a consultas 🩺';
      case 'exercicio':
        return 'Fazer exercícios 🏃‍♂️';
      case 'agua':
        return 'Beber água 💧';
      case 'pressao':
        return 'Medir pressão ❤️';
      case 'outro':
        return item.acaoPersonalizada || 'Outro Lembrete';
      default:
        return 'Ação de Saúde';
    }
  };

  const lembretesFiltrados = useMemo(
    () =>
      lembretes.filter((item) => {
        if (filtro === 'todos') return true;
        return item.tipo === filtro;
      }),
    [lembretes, filtro]
  );

  const medicamentosAtivos = useMemo(
    () => medicamentos.filter((m) => !m.descontinuado),
    [medicamentos]
  );

  const medicamentosDescontinuados = useMemo(
    () => medicamentos.filter((m) => Boolean(m.descontinuado)),
    [medicamentos]
  );

  // --- RENDERIZADORES ---
  const renderItemLembrete = ({ item }: { item: Lembrete }) => {
    const isRemedio = item.tipo === 'remedio';
    return (
      <View
        style={[
          styles.card,
          isRemedio ? styles.remedioCard : styles.acaoCard,
          item.concluido && styles.completedCard,
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, item.concluido && styles.completedText]}>
              {isRemedio ? item.nomeRemedio : obterTextoAcao(item)}
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
              🔄 Frequência: {item.frequencia}
            </Text>
          )}

          {isRemedio && item.observacoes && (
            <Text style={[styles.cardNotes, item.concluido && { color: '#4B5563' }]}>
              📝 Obs: {item.observacoes}
            </Text>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, item.concluido && styles.checkButtonActive]}
            onPress={() => handleAlternarConcluido(item)}
            activeOpacity={0.7}
            accessibilityLabel={item.concluido ? 'Desmarcar lembrete' : 'Concluir lembrete'}
          >
            <Text style={{ fontSize: 18 }}>{item.concluido ? '✅' : '⬜'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleAbrirEditarLembrete(item)}
            activeOpacity={0.7}
            accessibilityLabel="Editar lembrete"
          >
            <Text style={{ fontSize: 17 }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleExcluirLembrete(item.id, item.notificationId)}
            activeOpacity={0.7}
            accessibilityLabel="Excluir lembrete"
          >
            <Text style={{ fontSize: 17 }}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMedicamentoCard = ({ item }: { item: Medicamento }) => {
    const estoqueNum = parseInt(item.estoque || '0', 10);
    const isEstoqueBaixo = !isNaN(estoqueNum) && estoqueNum <= 5;
    const statusValidade = avaliarValidade(item.validade);

    return (
      <View style={[styles.medCard, isEstoqueBaixo && styles.medCardLowStock]}>
        <View style={styles.medTopRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.medTitle}>{item.nome}</Text>
            <Text style={styles.medSub}>
              {item.dosagem} • {item.forma}
            </Text>
          </View>

          <View style={[styles.medEstoqueBadge, isEstoqueBaixo && styles.medEstoqueBadgeLow]}>
            <Text style={[styles.medEstoqueText, isEstoqueBaixo && styles.medEstoqueTextLow]}>
              Qtd: {item.estoque}
            </Text>
          </View>
        </View>

        {isEstoqueBaixo && (
          <View style={styles.lowStockBanner}>
            <Text style={styles.lowStockText}>
              ⚠️ Estoque Baixo! ({estoqueNum === 0 ? 'Acabou' : `${estoqueNum} un. restantes`})
            </Text>
          </View>
        )}

        {(item.prescritor || item.validade || item.armazenamento) && (
          <View style={styles.medMetaBox}>
            {item.prescritor ? (
              <Text style={styles.medMetaLine}>👨‍⚕️ Prescritor: {item.prescritor}</Text>
            ) : null}
            {item.validade ? (
              <Text
                style={[
                  styles.medMetaLine,
                  statusValidade === 'vencido' && { color: '#991B1B', fontWeight: '800' },
                  statusValidade === 'proximo' && { color: '#B45309', fontWeight: '800' },
                ]}
              >
                📅 Validade: {item.validade}
                {statusValidade === 'vencido' ? ' (Vencido!)' : statusValidade === 'proximo' ? ' (Vence em breve)' : ''}
              </Text>
            ) : null}
            {item.armazenamento ? (
              <Text style={styles.medMetaLine}>📦 Armazenamento: {item.armazenamento}</Text>
            ) : null}
          </View>
        )}

        <View style={styles.medActionsRow}>
          <TouchableOpacity
            style={styles.medSecondaryBtn}
            onPress={() => handleAbrirEditarMed(item)}
            activeOpacity={0.75}
          >
            <Text style={styles.medSecondaryBtnText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.medWarnBtn}
            onPress={() => handleToggleDescontinuarMed(item)}
            activeOpacity={0.75}
          >
            <Text style={styles.medWarnBtnText}>⏸️ Descontinuar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.medDeleteButton}
            onPress={() => handleDeleteMed(item.id)}
            activeOpacity={0.75}
            accessibilityLabel="Excluir medicamento"
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
        <Text style={styles.subtitle}>Gerencie seus alarmes, doses e estoque de medicamentos.</Text>
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

      {activeTab === 'lembretes' ? (
        <>
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
              <Text style={[styles.filterTabText, filtro === 'remedio' && styles.filterTabTextActive]}>
                💊 Remédios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filtro === 'acao' && styles.filterTabActive]}
              onPress={() => setFiltro('acao')}
            >
              <Text style={[styles.filterTabText, filtro === 'acao' && styles.filterTabTextActive]}>⚡ Ações</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.newButton} activeOpacity={0.8} onPress={handleAbrirNovoLembrete}>
            <Text style={styles.newButtonText}>+ Novo Lembrete</Text>
          </TouchableOpacity>

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
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.pdfButton} activeOpacity={0.8} onPress={handleGeneratePDF}>
              <Text style={styles.buttonText}>Gerar PDF 📄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addMedButton} activeOpacity={0.8} onPress={handleAbrirNovoMed}>
              <Text style={styles.buttonText}>+ Medicamento</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={medicamentosAtivos}
            keyExtractor={(item) => item.id}
            renderItem={renderMedicamentoCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 36 }}>📦</Text>
                <Text style={styles.emptyText}>Nenhum medicamento ativo em estoque.</Text>
              </View>
            }
            ListFooterComponent={
              medicamentosDescontinuados.length > 0 ? (
                <View style={styles.discontinuedSection}>
                  <Text style={styles.discontinuedSectionTitle}>
                    Histórico de Medicamentos Descontinuados (RF20)
                  </Text>
                  {medicamentosDescontinuados.map((med) => (
                    <View key={med.id} style={styles.discontinuedCard}>
                      <Text style={styles.discontinuedTitle}>
                        {med.nome} ({med.dosagem})
                      </Text>
                      <Text style={styles.discontinuedMeta}>
                        {med.forma}
                        {med.dataTermino
                          ? ` • Encerrado em ${new Date(med.dataTermino).toLocaleDateString('pt-BR')}`
                          : ''}
                      </Text>
                      {med.prescritor ? (
                        <Text style={styles.discontinuedMeta}>Prescritor: {med.prescritor}</Text>
                      ) : null}
                      <View style={styles.medActionsRow}>
                        <TouchableOpacity
                          style={styles.medSecondaryBtn}
                          onPress={() => handleToggleDescontinuarMed(med)}
                        >
                          <Text style={styles.medSecondaryBtnText}>🔄 Reativar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.medDeleteButton}
                          onPress={() => handleDeleteMed(med.id)}
                        >
                          <Text style={{ fontSize: 16 }}>❌</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null
            }
          />
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>Voltar ao Painel</Text>
      </TouchableOpacity>

      {/* MODAL NOVO / EDITAR LEMBRETE (RF14) */}
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
            <Text style={styles.modalTitle}>
              {editingLembreteId ? 'Editar Lembrete' : 'Novo Lembrete'}
            </Text>

            {!editingLembreteId && (
              <View style={styles.categorySelector}>
                <TouchableOpacity
                  style={[styles.categoryTab, categoriaSelecionada === 'remedio' && styles.categoryTabActiveRemedio]}
                  onPress={() => setCategoriaSelecionada('remedio')}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      categoriaSelecionada === 'remedio' && styles.categoryTabTextActive,
                    ]}
                  >
                    💊 Remédio
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categoryTab, categoriaSelecionada === 'acao' && styles.categoryTabActiveAcao]}
                  onPress={() => setCategoriaSelecionada('acao')}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      categoriaSelecionada === 'acao' && styles.categoryTabTextActive,
                    ]}
                  >
                    ⚡ Ação
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {categoriaSelecionada === 'remedio' ? (
                <View>
                  <Text style={styles.label}>Nome do Remédio *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Paracetamol, Losartana"
                    placeholderTextColor="#6B7280"
                    value={nomeRemedio}
                    onChangeText={setNomeRemedio}
                  />

                  <Text style={styles.label}>Horário *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 08:00, 22:30"
                    placeholderTextColor="#6B7280"
                    value={horarioRemedio}
                    onChangeText={setHorarioRemedio}
                    keyboardType="numbers-and-punctuation"
                  />

                  <Text style={styles.label}>Frequência *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: A cada 8 horas, Uma vez ao dia"
                    placeholderTextColor="#6B7280"
                    value={frequenciaRemedio}
                    onChangeText={setFrequenciaRemedio}
                  />

                  <Text style={styles.label}>Observações Opcionais</Text>
                  <TextInput
                    style={[styles.input, { height: 84, textAlignVertical: 'top' }]}
                    placeholder="Ex: Tomar após o almoço"
                    placeholderTextColor="#6B7280"
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
                        item === 'consulta'
                          ? 'Ida a consultas 🩺'
                          : item === 'exercicio'
                            ? 'Fazer exercícios 🏃‍♂️'
                            : item === 'agua'
                              ? 'Beber água 💧'
                              : item === 'pressao'
                                ? 'Medir pressão ❤️'
                                : 'Outros 📝';

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
                        placeholderTextColor="#6B7280"
                        value={acaoPersonalizada}
                        onChangeText={setAcaoPersonalizada}
                      />
                    </View>
                  )}

                  <Text style={styles.label}>Horário *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 14:00, 19:30"
                    placeholderTextColor="#6B7280"
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
                  categoriaSelecionada === 'remedio' ? styles.btnSalvarRemedio : styles.btnSalvarAcao,
                ]}
                onPress={handleSalvarLembrete}
              >
                <Text style={styles.btnSalvarText}>{editingLembreteId ? 'Atualizar' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL NOVO / EDITAR MEDICAMENTO (ESTOQUE - RF15, RF17, RF19) */}
      <Modal
        visible={medModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setMedModalVisible(false);
          limparCamposMed();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingMedId ? 'Editar Medicamento' : 'Novo Medicamento'}
            </Text>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Nome do Medicamento *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Losartana, Metformina"
                placeholderTextColor="#6B7280"
                value={nomeMed}
                onChangeText={setNomeMed}
              />

              <Text style={styles.label}>Dosagem *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50mg, 5ml"
                placeholderTextColor="#6B7280"
                value={dosagemMed}
                onChangeText={setDosagemMed}
              />

              <Text style={styles.label}>Forma Farmacêutica</Text>
              <View style={styles.selectRow}>
                {FORMA_OPCOES.map((forma) => (
                  <TouchableOpacity
                    key={forma}
                    style={[styles.selectItem, formaMed === forma && styles.selectItemActive]}
                    onPress={() => setFormaMed(forma)}
                  >
                    <Text style={[styles.selectItemText, formaMed === forma && styles.selectItemTextActive]}>
                      {forma}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ex: Comprimido, Xarope, Gotas"
                placeholderTextColor="#6B7280"
                value={formaMed}
                onChangeText={setFormaMed}
              />

              <Text style={styles.label}>Quantidade em Estoque</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 30, 60"
                placeholderTextColor="#6B7280"
                value={estoqueMed}
                onChangeText={(text) => setEstoqueMed(text.replace(/[^\d]/g, ''))}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Médico / Prescritor (RF15)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Dr(a). João Oliveira — UBS Centro"
                placeholderTextColor="#6B7280"
                value={prescritorMed}
                onChangeText={setPrescritorMed}
              />

              <Text style={styles.label}>Data de Validade (RF17)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 12/2026 ou 20/11/2026"
                placeholderTextColor="#6B7280"
                value={validadeMed}
                onChangeText={setValidadeMed}
              />

              <Text style={styles.label}>Orientação de Armazenamento (RF19)</Text>
              <View style={styles.selectRow}>
                {ARMAZENAMENTO_OPCOES.map((op) => (
                  <TouchableOpacity
                    key={op}
                    style={[styles.selectItem, armazenamentoMed === op && styles.selectItemActive]}
                    onPress={() => setArmazenamentoMed(op)}
                  >
                    <Text style={[styles.selectItemText, armazenamentoMed === op && styles.selectItemTextActive]}>
                      {op}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ex: Manter na geladeira (2–8 °C)"
                placeholderTextColor="#6B7280"
                value={armazenamentoMed}
                onChangeText={setArmazenamentoMed}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => {
                  setMedModalVisible(false);
                  limparCamposMed();
                }}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSalvar, { backgroundColor: '#15803D' }]}
                onPress={handleSaveMed}
              >
                <Text style={styles.btnSalvarText}>{editingMedId ? 'Atualizar' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
