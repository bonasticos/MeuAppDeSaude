import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { salvarPerfil, uploadAvatar } from '../../services/db';
import { styles } from './styles';

type ConfiguracoesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracoes'>;

interface Props {
  navigation: ConfiguracoesScreenNavigationProp;
}

export default function TelaConfiguracoes({ navigation }: Props) {
  const { perfil, updatePerfil, logout } = useStore();

  const [nome, setNome] = useState(perfil?.nome || '');
  const [telefone, setTelefone] = useState(perfil?.telefone || '');
  const [fotoUri, setFotoUri] = useState<string | null>(perfil?.fotoUri || null);

  const [authEmail, setAuthEmail] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverModalVisible, setRecoverModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const email = data?.user?.email || '';
        setAuthEmail(email);
        setRecoveryEmail((prev) => prev || email);
      })
      .catch(() => {});
  }, []);

  const mostrarAlerta = (titulo: string, mensagem: string, onOk?: () => void) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
      if (onOk) onOk();
      return;
    }

    Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: onOk }]);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      mostrarAlerta('Permissão Negada', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let finalFotoUri = fotoUri;

    try {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (user) {
          if (fotoUri && !fotoUri.startsWith('http')) {
            const uploadedUrl = await uploadAvatar(user.id, fotoUri);
            if (uploadedUrl) {
              finalFotoUri = uploadedUrl;
              setFotoUri(uploadedUrl);
            }
          }
          try {
            await salvarPerfil(user.id, { nome, telefone, fotoUri: finalFotoUri });
          } catch (err) {
            console.warn('Erro ao sincronizar configurações com o Supabase:', err);
          }
        }
      }

      updatePerfil({ nome, telefone, fotoUri: finalFotoUri });
      mostrarAlerta('Sucesso', 'Configurações salvas com sucesso!', () => navigation.goBack());
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRecoverModal = () => {
    if (!recoveryEmail && authEmail) {
      setRecoveryEmail(authEmail);
    }
    setRecoverModalVisible(true);
  };

  const handleSendPasswordReset = async () => {
    const emailLimpo = recoveryEmail.trim();
    if (!emailLimpo || !emailLimpo.includes('@')) {
      mostrarAlerta('Atenção', 'Informe um endereço de e-mail válido para enviar o link.');
      return;
    }

    if (!isSupabaseConfigured) {
      setRecoverModalVisible(false);
      mostrarAlerta(
        'Modo Demonstração Local',
        `Para disparar o e-mail real de redefinição para ${emailLimpo}, configure as credenciais do Supabase no arquivo .env.`
      );
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo);
      if (error) {
        mostrarAlerta('Erro ao Enviar', error.message);
        return;
      }

      setRecoverModalVisible(false);
      mostrarAlerta(
        'E-mail Enviado',
        `As instruções para redefinição de senha foram enviadas para ${emailLimpo}.`
      );
    } finally {
      setSendingReset(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Erro ao encerrar sessão no Supabase:', err);
      }
    }

    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Configurações</Text>
        {authEmail ? (
          <Text style={styles.accountSubtitle}>Conta conectada: {authEmail}</Text>
        ) : null}

        <TouchableOpacity style={styles.photoContainer} onPress={handlePickImage} activeOpacity={0.8}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color="#4B5563" />
            </View>
          )}
          <Text style={styles.changePhotoText}>Alterar Foto</Text>
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.recoverButton} onPress={handleOpenRecoverModal}>
          <Text style={styles.recoverButtonText}>Recuperar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutUncButton} onPress={() => navigation.navigate('SobreUNC')}>
          <Text style={styles.aboutUncButtonText}>Sobre a UNC & Desenvolvedores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair do Aplicativo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Recuperação de Senha (Supabase resetPasswordForEmail) */}
      <Modal
        visible={recoverModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRecoverModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <Text style={styles.modalSubtitle}>
              Informe o e-mail da sua conta para enviarmos o link de redefinição de senha.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#6B7280"
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRecoverModalVisible(false)}
                disabled={sendingReset}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmBtn, sendingReset && { opacity: 0.7 }]}
                onPress={handleSendPasswordReset}
                disabled={sendingReset}
              >
                {sendingReset ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Enviar Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
