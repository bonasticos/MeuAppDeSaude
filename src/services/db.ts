import { supabase } from './supabase';
import {
  Lembrete,
  LembreteInput,
  SinalVital,
  HumorRegistro,
  Medicamento,
  SinalVitalEnfermagem,
  Treino,
  RegistroDor,
  PerfilUsuario
} from '../types';

const handleError = (error: any, operation: string) => {
  console.error(`Erro na operação ${operation} (Supabase): `, error);
  throw error;
};

// ==========================================
// USUÁRIO / PERFIL (tabela: perfis)
// ==========================================
export const salvarPerfil = async (userId: string, perfil: Partial<PerfilUsuario>) => {
  const { error } = await supabase
    .from('perfis')
    .upsert({ id: userId, ...perfil, updated_at: new Date().toISOString() });

  if (error) handleError(error, 'salvarPerfil');
};

export const buscarPerfil = async (userId: string): Promise<PerfilUsuario | null> => {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) handleError(error, 'buscarPerfil');
  return data as PerfilUsuario | null;
};

export const escutarPerfil = (userId: string, callback: (perfil: PerfilUsuario | null) => void) => {
  buscarPerfil(userId).then(callback).catch(() => callback(null));

  const channel = supabase
    .channel(`perfis:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'perfis', filter: `id=eq.${userId}` },
      (payload) => {
        callback((payload.new as PerfilUsuario) || null);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// LEMBRETES (tabela: lembretes)
// ==========================================
export const adicionarLembrete = async (userId: string, lembrete: LembreteInput) => {
  const { data, error } = await supabase
    .from('lembretes')
    .insert({ user_id: userId, ...lembrete })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarLembrete');
  return data?.id as string | undefined;
};

export const removerLembrete = async (userId: string, lembreteId: string) => {
  const { error } = await supabase
    .from('lembretes')
    .delete()
    .eq('id', lembreteId)
    .eq('user_id', userId);

  if (error) handleError(error, 'removerLembrete');
};

export const listarLembretes = async (userId: string): Promise<Lembrete[]> => {
  const { data, error } = await supabase
    .from('lembretes')
    .select('*')
    .eq('user_id', userId);

  if (error) handleError(error, 'listarLembretes');
  return (data || []) as Lembrete[];
};

export const escutarLembretes = (userId: string, callback: (lembretes: Lembrete[]) => void) => {
  listarLembretes(userId).then(callback).catch(() => callback([]));

  const channel = supabase
    .channel(`lembretes:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'lembretes', filter: `user_id=eq.${userId}` },
      async () => {
        const atualizados = await listarLembretes(userId);
        callback(atualizados);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// MEDICAMENTOS (tabela: medicamentos)
// ==========================================
export const adicionarMedicamento = async (userId: string, med: Omit<Medicamento, 'id'>) => {
  const { data, error } = await supabase
    .from('medicamentos')
    .insert({ user_id: userId, ...med })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarMedicamento');
  return data?.id as string | undefined;
};

export const removerMedicamento = async (userId: string, medId: string) => {
  const { error } = await supabase
    .from('medicamentos')
    .delete()
    .eq('id', medId)
    .eq('user_id', userId);

  if (error) handleError(error, 'removerMedicamento');
};

export const listarMedicamentos = async (userId: string): Promise<Medicamento[]> => {
  const { data, error } = await supabase
    .from('medicamentos')
    .select('*')
    .eq('user_id', userId);

  if (error) handleError(error, 'listarMedicamentos');
  return (data || []) as Medicamento[];
};

export const escutarMedicamentos = (userId: string, callback: (medicamentos: Medicamento[]) => void) => {
  listarMedicamentos(userId).then(callback).catch(() => callback([]));

  const channel = supabase
    .channel(`medicamentos:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'medicamentos', filter: `user_id=eq.${userId}` },
      async () => {
        const atualizados = await listarMedicamentos(userId);
        callback(atualizados);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// SINAIS VITAIS (tabela: sinais_vitais)
// ==========================================
export const adicionarSinalVital = async (userId: string, sinal: Omit<SinalVital, 'id'>) => {
  const { data, error } = await supabase
    .from('sinais_vitais')
    .insert({ user_id: userId, ...sinal })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarSinalVital');
  return data?.id as string | undefined;
};

export const listarSinaisVitais = async (userId: string): Promise<SinalVital[]> => {
  const { data, error } = await supabase
    .from('sinais_vitais')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) handleError(error, 'listarSinaisVitais');
  return (data || []) as SinalVital[];
};

export const escutarSinaisVitais = (userId: string, callback: (sinais: SinalVital[]) => void) => {
  listarSinaisVitais(userId).then(callback).catch(() => callback([]));

  const channel = supabase
    .channel(`sinais_vitais:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sinais_vitais', filter: `user_id=eq.${userId}` },
      async () => {
        const atualizados = await listarSinaisVitais(userId);
        callback(atualizados);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// SINAIS VITAIS ENFERMAGEM (tabela: sinais_enfermagem)
// ==========================================
export const adicionarSinalEnfermagem = async (userId: string, sinal: Omit<SinalVitalEnfermagem, 'id'>) => {
  const { data, error } = await supabase
    .from('sinais_enfermagem')
    .insert({ user_id: userId, ...sinal })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarSinalEnfermagem');
  return data?.id as string | undefined;
};

// ==========================================
// HUMOR (tabela: humor_historico)
// ==========================================
export const adicionarHumor = async (userId: string, humor: Omit<HumorRegistro, 'id'>) => {
  const { data, error } = await supabase
    .from('humor_historico')
    .insert({ user_id: userId, ...humor })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarHumor');
  return data?.id as string | undefined;
};

export const listarHumor = async (userId: string): Promise<HumorRegistro[]> => {
  const { data, error } = await supabase
    .from('humor_historico')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) handleError(error, 'listarHumor');
  return (data || []) as HumorRegistro[];
};

export const escutarHumor = (userId: string, callback: (humorList: HumorRegistro[]) => void) => {
  listarHumor(userId).then(callback).catch(() => callback([]));

  const channel = supabase
    .channel(`humor_historico:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'humor_historico', filter: `user_id=eq.${userId}` },
      async () => {
        const atualizados = await listarHumor(userId);
        callback(atualizados);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// TREINOS (tabela: treinos)
// ==========================================
export const adicionarTreino = async (userId: string, treino: Omit<Treino, 'id'>) => {
  const { data, error } = await supabase
    .from('treinos')
    .insert({ user_id: userId, ...treino })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarTreino');
  return data?.id as string | undefined;
};

export const listarTreinos = async (userId: string): Promise<Treino[]> => {
  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) handleError(error, 'listarTreinos');
  return (data || []) as Treino[];
};

export const escutarTreinos = (userId: string, callback: (treinos: Treino[]) => void) => {
  listarTreinos(userId).then(callback).catch(() => callback([]));

  const channel = supabase
    .channel(`treinos:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'treinos', filter: `user_id=eq.${userId}` },
      async () => {
        const atualizados = await listarTreinos(userId);
        callback(atualizados);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==========================================
// HISTÓRICO DE DOR / FISIOTERAPIA (tabela: historico_dor)
// ==========================================
export const adicionarRegistroDor = async (userId: string, dor: Omit<RegistroDor, 'id'>) => {
  const { data, error } = await supabase
    .from('historico_dor')
    .insert({ user_id: userId, ...dor })
    .select('id')
    .single();

  if (error) handleError(error, 'adicionarRegistroDor');
  return data?.id as string | undefined;
};

export const listarHistoricoDor = async (userId: string): Promise<RegistroDor[]> => {
  const { data, error } = await supabase
    .from('historico_dor')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) handleError(error, 'listarHistoricoDor');
  return (data || []) as RegistroDor[];
};

// ==========================================
// STORAGE: AVATARS (bucket: avatars)
// ==========================================
export const uploadAvatar = async (userId: string, localUri: string): Promise<string | null> => {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const ext = localUri.split('.').pop()?.split('?')[0] || 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, blob, { upsert: true });

    if (error) handleError(error, 'uploadAvatar');

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Falha no uploadAvatar (Supabase Storage):', err);
    return null;
  }
};
