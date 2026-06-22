import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  Lembrete, 
  SinalVital, 
  HumorRegistro, 
  Medicamento, 
  SinalVitalEnfermagem, 
  Treino, 
  RegistroDor, 
  PerfilUsuario 
} from '../types';

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

export const useStore = create<EstadoGlobal>()(
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

