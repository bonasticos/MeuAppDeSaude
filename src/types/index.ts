export interface Lembrete {
  id: string;
  title: string;
  type: string;
  time: string;
  color: string;
}

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
