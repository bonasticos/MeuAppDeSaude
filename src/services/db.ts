import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
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

// FunÃ§Ã£o auxiliar para lidar com erros
const handleError = (error: any, operation: string) => {
  console.error(`Erro na operaÃ§Ã£o ${operation}: `, error);
  throw error;
};

// ==========================================
// USUÃRIO / PERFIL
// ==========================================
export const salvarPerfil = async (userId: string, perfil: Partial<PerfilUsuario>) => {
  try {
    const docRef = doc(db, 'usuarios', userId);
    await setDoc(docRef, perfil, { merge: true });
  } catch (error) {
    handleError(error, 'salvarPerfil');
  }
};

export const escutarPerfil = (userId: string, callback: (perfil: PerfilUsuario | null) => void) => {
  const docRef = doc(db, 'usuarios', userId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PerfilUsuario);
    } else {
      callback(null);
    }
  });
};

// ==========================================
// LEMBRETES
// ==========================================
export const adicionarLembrete = async (userId: string, lembrete: Omit<Lembrete, 'id'>) => {
  try {
    const collRef = collection(db, `usuarios/${userId}/lembretes`);
    const docRef = await addDoc(collRef, lembrete);
    return docRef.id;
  } catch (error) {
    handleError(error, 'adicionarLembrete');
  }
};

export const removerLembrete = async (userId: string, lembreteId: string) => {
  try {
    const docRef = doc(db, `usuarios/${userId}/lembretes`, lembreteId);
    await deleteDoc(docRef);
  } catch (error) {
    handleError(error, 'removerLembrete');
  }
};

export const escutarLembretes = (userId: string, callback: (lembretes: Lembrete[]) => void) => {
  const collRef = collection(db, `usuarios/${userId}/lembretes`);
  return onSnapshot(collRef, (snapshot) => {
    const lembretes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lembrete));
    callback(lembretes);
  });
};

// ==========================================
// MEDICAMENTOS
// ==========================================
export const adicionarMedicamento = async (userId: string, med: Omit<Medicamento, 'id'>) => {
  try {
    const collRef = collection(db, `usuarios/${userId}/medicamentos`);
    const docRef = await addDoc(collRef, med);
    return docRef.id;
  } catch (error) {
    handleError(error, 'adicionarMedicamento');
  }
};

export const removerMedicamento = async (userId: string, medId: string) => {
  try {
    const docRef = doc(db, `usuarios/${userId}/medicamentos`, medId);
    await deleteDoc(docRef);
  } catch (error) {
    handleError(error, 'removerMedicamento');
  }
};

export const escutarMedicamentos = (userId: string, callback: (medicamentos: Medicamento[]) => void) => {
  const collRef = collection(db, `usuarios/${userId}/medicamentos`);
  return onSnapshot(collRef, (snapshot) => {
    const medicamentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medicamento));
    callback(medicamentos);
  });
};

// ==========================================
// SINAIS VITAIS (BPM, Glicose, etc)
// ==========================================
export const adicionarSinalVital = async (userId: string, sinal: Omit<SinalVital, 'id'>) => {
  try {
    const collRef = collection(db, `usuarios/${userId}/sinaisVitais`);
    const docRef = await addDoc(collRef, sinal);
    return docRef.id;
  } catch (error) {
    handleError(error, 'adicionarSinalVital');
  }
};

export const escutarSinaisVitais = (userId: string, callback: (sinais: SinalVital[]) => void) => {
  const collRef = collection(db, `usuarios/${userId}/sinaisVitais`);
  // Pode adicionar orderBy aqui futuramente
  return onSnapshot(collRef, (snapshot) => {
    const sinais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SinalVital));
    callback(sinais);
  });
};

// ==========================================
// HUMOR
// ==========================================
export const adicionarHumor = async (userId: string, humor: Omit<HumorRegistro, 'id'>) => {
  try {
    const collRef = collection(db, `usuarios/${userId}/humorHistorico`);
    const docRef = await addDoc(collRef, humor);
    return docRef.id;
  } catch (error) {
    handleError(error, 'adicionarHumor');
  }
};

export const escutarHumor = (userId: string, callback: (humorList: HumorRegistro[]) => void) => {
  const collRef = collection(db, `usuarios/${userId}/humorHistorico`);
  return onSnapshot(collRef, (snapshot) => {
    const humorList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HumorRegistro));
    callback(humorList);
  });
};

// ==========================================
// TREINOS
// ==========================================
export const adicionarTreino = async (userId: string, treino: Omit<Treino, 'id'>) => {
  try {
    const collRef = collection(db, `usuarios/${userId}/treinos`);
    const docRef = await addDoc(collRef, treino);
    return docRef.id;
  } catch (error) {
    handleError(error, 'adicionarTreino');
  }
};

export const escutarTreinos = (userId: string, callback: (treinos: Treino[]) => void) => {
  const collRef = collection(db, `usuarios/${userId}/treinos`);
  return onSnapshot(collRef, (snapshot) => {
    const treinos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treino));
    callback(treinos);
  });
};

