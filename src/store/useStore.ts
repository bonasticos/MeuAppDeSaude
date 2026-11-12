import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Lembrete,
  LembreteInput,
  LembretePatch,
  SinalVital,
  HumorRegistro,
  AvaliacaoPsicologica,
  Medicamento,
  SinalVitalEnfermagem,
  Treino,
  RegistroDor,
  PesoImcRegistro,
  ChecklistCuidadoDiario,
  PerfilUsuario
} from '../types';

interface EstadoGlobal {
  lembretes: Lembrete[];
  addLembrete: (lembrete: LembreteInput) => void;
  updateLembrete: (id: string, dados: LembretePatch) => void;
  removeLembrete: (id: string) => void;
  setLembretes: (lembretes: Lembrete[]) => void;

  sinaisVitais: SinalVital[];
  addSinalVital: (sinal: Omit<SinalVital, 'id' | 'data'>) => void;
  updateSinalVital: (id: string, dados: Partial<Omit<SinalVital, 'id'>>) => void;
  removeSinalVital: (id: string) => void;

  humorHistorico: HumorRegistro[];
  addHumor: (humor: Omit<HumorRegistro, 'id' | 'data'>) => void;

  avaliacoesPsicologia: AvaliacaoPsicologica[];
  addAvaliacaoPsicologia: (avaliacao: Omit<AvaliacaoPsicologica, 'id' | 'data'>) => void;

  medicamentos: Medicamento[];
  addMedicamento: (med: Omit<Medicamento, 'id'>) => void;
  updateMedicamento: (id: string, dados: Partial<Omit<Medicamento, 'id'>>) => void;
  removeMedicamento: (id: string) => void;
  setMedicamentos: (medicamentos: Medicamento[]) => void;

  sinaisEnfermagem: SinalVitalEnfermagem[];
  addSinalEnfermagem: (sinal: Omit<SinalVitalEnfermagem, 'id' | 'data'>) => void;

  checklistCuidados: ChecklistCuidadoDiario | null;
  setChecklistCuidados: (checklist: ChecklistCuidadoDiario) => void;

  treinos: Treino[];
  addTreino: (treino: Omit<Treino, 'id' | 'data'>) => void;

  historicoDor: RegistroDor[];
  addRegistroDor: (dor: Omit<RegistroDor, 'id' | 'data'>) => void;

  historicoImc: PesoImcRegistro[];
  addRegistroPesoImc: (registro: Omit<PesoImcRegistro, 'id' | 'data'>) => void;

  perfil: PerfilUsuario | null;
  updatePerfil: (perfil: Partial<PerfilUsuario>) => void;
  logout: () => void;
}

const gerarIdLocal = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useStore = create<EstadoGlobal>()(
  persist(
    (set) => ({
      perfil: null,
      updatePerfil: (novosDados) => set((state) => ({
        perfil: state.perfil
          ? { ...state.perfil, ...novosDados }
          : { nome: '', fotoUri: null, telefone: '', ...novosDados } as PerfilUsuario
      })),
      logout: () => set({
        perfil: null,
        lembretes: [],
        sinaisVitais: [],
        humorHistorico: [],
        avaliacoesPsicologia: [],
        medicamentos: [],
        sinaisEnfermagem: [],
        checklistCuidados: null,
        treinos: [],
        historicoDor: [],
        historicoImc: []
      }),
      lembretes: [],
      addLembrete: (lembrete) => set((state) => ({
        lembretes: [...(state.lembretes || []), { ...lembrete, id: gerarIdLocal() } as Lembrete]
      })),
      updateLembrete: (id, dados) => set((state) => ({
        lembretes: (state.lembretes || []).map((item) =>
          item.id === id ? ({ ...item, ...dados } as Lembrete) : item
        )
      })),
      removeLembrete: (id) => set((state) => ({
        lembretes: (state.lembretes || []).filter(l => l.id !== id)
      })),
      setLembretes: (lembretes) => set({ lembretes }),

      sinaisVitais: [],
      addSinalVital: (sinal) => set((state) => ({
        sinaisVitais: [...(state.sinaisVitais || []), { ...sinal, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),
      updateSinalVital: (id, dados) => set((state) => ({
        sinaisVitais: (state.sinaisVitais || []).map((item) =>
          item.id === id ? { ...item, ...dados } : item
        )
      })),
      removeSinalVital: (id) => set((state) => ({
        sinaisVitais: (state.sinaisVitais || []).filter((item) => item.id !== id)
      })),

      humorHistorico: [],
      addHumor: (humor) => set((state) => ({
        humorHistorico: [...(state.humorHistorico || []), { ...humor, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),

      avaliacoesPsicologia: [],
      addAvaliacaoPsicologia: (avaliacao) => set((state) => ({
        avaliacoesPsicologia: [
          ...(state.avaliacoesPsicologia || []),
          { ...avaliacao, id: gerarIdLocal(), data: new Date().toISOString() }
        ]
      })),

      medicamentos: [],
      addMedicamento: (med) => set((state) => ({
        medicamentos: [...(state.medicamentos || []), { ...med, id: gerarIdLocal() }]
      })),
      updateMedicamento: (id, dados) => set((state) => ({
        medicamentos: (state.medicamentos || []).map((item) =>
          item.id === id ? { ...item, ...dados } : item
        )
      })),
      removeMedicamento: (id) => set((state) => ({
        medicamentos: (state.medicamentos || []).filter((item) => item.id !== id)
      })),
      setMedicamentos: (medicamentos) => set({ medicamentos }),

      sinaisEnfermagem: [],
      addSinalEnfermagem: (sinal) => set((state) => ({
        sinaisEnfermagem: [...(state.sinaisEnfermagem || []), { ...sinal, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),

      checklistCuidados: null,
      setChecklistCuidados: (checklist) => set({ checklistCuidados: checklist }),

      treinos: [],
      addTreino: (treino) => set((state) => ({
        treinos: [...(state.treinos || []), { ...treino, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),

      historicoDor: [],
      addRegistroDor: (dor) => set((state) => ({
        historicoDor: [...(state.historicoDor || []), { ...dor, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),

      historicoImc: [],
      addRegistroPesoImc: (registro) => set((state) => ({
        historicoImc: [...(state.historicoImc || []), { ...registro, id: gerarIdLocal(), data: new Date().toISOString() }]
      })),
    }),
    {
      name: 'meu-app-saude-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
