import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  pressao?: string;
  data: string;
}

export interface HumorRegistro {
  id: string;
  moodId: string;
  activity: string;
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
  data: string;
}

export interface RegistroDor {
  id: string;
  nivel: number;
  data: string;
}
export interface PerfilUsuario {
  nome: string;
  fotoUri: string | null;
  telefone: string;
}

interface EstadoGlobal {
  lembretes: Lembrete[];
  addLembrete: (lembrete: Omit<Lembrete, 'id'>) => void;
  removeLembrete: (id: string) => void;

  sinaisVitais: SinalVital[];
  addSinalVital: (sinal: Omit<SinalVital, 'id' | 'data'>) => void;

  humorHistorico: HumorRegistro[];
  addHumor: (humor: Omit<HumorRegistro, 'id' | 'data'>) => void;

  medicamentos: Medicamento[];
  addMedicamento: (med: Omit<Medicamento, 'id'>) => void;

  sinaisEnfermagem: SinalVitalEnfermagem[];
  addSinalEnfermagem: (sinal: Omit<SinalVitalEnfermagem, 'id' | 'data'>) => void;

  treinos: Treino[];
  addTreino: (treino: Omit<Treino, 'id' | 'data'>) => void;

  historicoDor: RegistroDor[];
  addRegistroDor: (dor: Omit<RegistroDor, 'id' | 'data'>) => void;

  perfil: PerfilUsuario | null;
  updatePerfil: (perfil: Partial<PerfilUsuario>) => void;
}

export const useEstadoGlobal = create<EstadoGlobal>()(
  persist(
    (set) => ({
      perfil: null,
      updatePerfil: (novosDados) => set((state) => ({
        perfil: state.perfil ? { ...state.perfil, ...novosDados } : { nome: '', fotoUri: null, telefone: '', ...novosDados } as PerfilUsuario
      })),
      lembretes: [],
      addLembrete: (lembrete) => set((state) => ({
        lembretes: [...state.lembretes, { ...lembrete, id: Math.random().toString() }]
      })),
      removeLembrete: (id) => set((state) => ({
        lembretes: state.lembretes.filter(l => l.id !== id)
      })),

      sinaisVitais: [],
      addSinalVital: (sinal) => set((state) => ({
        sinaisVitais: [...state.sinaisVitais, { ...sinal, id: Math.random().toString(), data: new Date().toISOString() }]
      })),

      humorHistorico: [],
      addHumor: (humor) => set((state) => ({
        humorHistorico: [...state.humorHistorico, { ...humor, id: Math.random().toString(), data: new Date().toISOString() }]
      })),

      medicamentos: [],
      addMedicamento: (med) => set((state) => ({
        medicamentos: [...state.medicamentos, { ...med, id: Math.random().toString() }]
      })),

      sinaisEnfermagem: [],
      addSinalEnfermagem: (sinal) => set((state) => ({
        sinaisEnfermagem: [...state.sinaisEnfermagem, { ...sinal, id: Math.random().toString(), data: new Date().toISOString() }]
      })),

      treinos: [],
      addTreino: (treino) => set((state) => ({
        treinos: [...state.treinos, { ...treino, id: Math.random().toString(), data: new Date().toISOString() }]
      })),

      historicoDor: [],
      addRegistroDor: (dor) => set((state) => ({
        historicoDor: [...state.historicoDor, { ...dor, id: Math.random().toString(), data: new Date().toISOString() }]
      })),
    }),
    {
      name: 'meu-app-saude-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
