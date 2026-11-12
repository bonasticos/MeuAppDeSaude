export interface LembreteBase {
  id: string;
  tipo: 'remedio' | 'acao';
  concluido: boolean;
  horario: string; // Ex: 08:00
  notificationId?: string;
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

export type Lembrete = LembreteRemedio | LembreteAcao;
export type LembreteInput = Omit<LembreteRemedio, 'id'> | Omit<LembreteAcao, 'id'>;
export type LembretePatch = Partial<Omit<LembreteRemedio, 'id' | 'tipo'>> & Partial<Omit<LembreteAcao, 'id' | 'tipo'>>;

export interface SinalVital {
  id: string;
  bpm: string;
  glicose: string;
  glicoseTipo?: string;
  pressao?: string;
  oxigenacao?: string;
  temperatura?: string;
  humor?: string;
  exercicio?: boolean;
  data: string;
}

export interface HumorRegistro {
  id: string;
  moodId: string;
  activity?: string;
  data: string;
}

export interface AvaliacaoPsicologica {
  id: string;
  tipo: 'PHQ-9' | 'GAD-7';
  pontuacao: number;
  maxPontuacao: number;
  classificacao: string;
  orientacao: string;
  alertaCritico?: boolean;
  data: string;
}

export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  forma: string;
  estoque: string;
  prescritor?: string;
  validade?: string;
  armazenamento?: string;
  descontinuado?: boolean;
  dataInicio?: string;
  dataTermino?: string;
}

export interface SinalVitalEnfermagem {
  id: string;
  temperatura: string;
  pressao: string;
  spo2: string;
  data: string;
}

export interface Treino {
  id: string;
  descricao: string;
  duracaoMinutos?: number;
  intensidade?: 'Leve' | 'Moderado' | 'Intenso';
  caloriasEstimadas?: number;
  data: string;
}

export interface RegistroDor {
  id: string;
  nivel: number;
  data: string;
}

export interface PesoImcRegistro {
  id: string;
  peso: number;
  imc?: number;
  data: string;
}

export interface ChecklistCuidadoDiario {
  data: string; // YYYY-MM-DD
  itensConcluidos: string[];
}

export interface PerfilUsuario {
  nome: string;
  fotoUri: string | null;
  telefone: string;
  frequenciaAtividade?: string;
  idade?: string;
  peso?: string;
  altura?: string;
  sexo?: string;
  imc?: number;
  comorbidades?: string[];
  alergias?: string;
}
