import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { salvarPerfil } from '../../services/db';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

WebBrowser.maybeCompleteAuthSession();
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'SEU_CLIENT_ID_WEB.apps.googleusercontent.com';
const isGoogleClientConfigured =
  Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) &&
  !GOOGLE_CLIENT_ID.includes('SEU_CLIENT_ID_WEB');

export default function LoginScreen({ navigation }: Props) {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [recoverModalVisible, setRecoverModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
  });

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (!isSupabaseConfigured) {
        mostrarAlerta('Aviso', 'Configure as variáveis do Supabase no arquivo .env para concluir o login Google.');
        return;
      }

      setLoading(true);
      supabase.auth
        .signInWithIdToken({
          provider: 'google',
          token: id_token,
        })
        .then(async ({ data, error }) => {
          if (error) {
            mostrarAlerta('Erro', 'Não foi possível fazer login com o Google no Supabase.');
            console.error(error);
            return;
          }

          if (data.user) {
            const nomeGoogle =
              (data.user.user_metadata?.full_name as string | undefined) ||
              (data.user.user_metadata?.name as string | undefined) ||
              '';
            const avatarGoogle = (data.user.user_metadata?.avatar_url as string | undefined) || null;
            if (nomeGoogle || avatarGoogle) {
              useStore.getState().updatePerfil({
                ...(nomeGoogle ? { nome: nomeGoogle } : {}),
                ...(avatarGoogle ? { fotoUri: avatarGoogle } : {}),
              });
              try {
                await salvarPerfil(data.user.id, { nome: nomeGoogle, fotoUri: avatarGoogle });
              } catch {
                // Perfil inicial será sincronizado posteriormente se já existir
              }
            }
          }
          navigation.replace('Inicial');
        })
        .finally(() => setLoading(false));
    }
  }, [response, navigation]);

  const handleLogin = async () => {
    if (!emailOrCpf.trim() || !password) {
      mostrarAlerta('Erro', 'Preencha todos os campos.');
      return;
    }

    // Modo demonstração local (admin/admin) continua funcionando para testes rápidos
    if (emailOrCpf.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
      navigation.replace('Inicial');
      return;
    }

    if (isSupabaseConfigured) {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrCpf.trim(),
          password: password.trim(),
        });

        if (error) {
          mostrarAlerta('Erro de Autenticação', error.message);
          return;
        }

        navigation.replace('Inicial');
      } finally {
        setLoading(false);
      }
    } else {
      mostrarAlerta(
        'Modo Local / Demonstração',
        'Credenciais inválidas. Use admin/admin para testar localmente, entre sem login, ou configure o Supabase no arquivo .env.'
      );
    }
  };

  const handleGoogleLogin = () => {
    if (!isSupabaseConfigured || !isGoogleClientConfigured) {
      mostrarAlerta(
        'Configuração Google OAuth Pendente',
        'Configure EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY e EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID no arquivo .env para autenticar com Google.'
      );
      return;
    }
    void promptAsync();
  };

  const handleOpenRecover = () => {
    if (emailOrCpf.includes('@')) {
      setRecoveryEmail(emailOrCpf.trim());
    }
    setRecoverModalVisible(true);
  };

  const handleSendPasswordReset = async () => {
    const emailLimpo = recoveryEmail.trim();
    if (!emailLimpo || !emailLimpo.includes('@')) {
      mostrarAlerta('Atenção', 'Informe um e-mail válido para recuperar a senha.');
      return;
    }

    if (!isSupabaseConfigured) {
      setRecoverModalVisible(false);
      mostrarAlerta(
        'Modo Demonstração Local',
        `Para enviar o link real de recuperação para ${emailLimpo}, configure o Supabase no arquivo .env.`
      );
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo);
      if (error) {
        mostrarAlerta('Erro', error.message);
        return;
      }
      setRecoverModalVisible(false);
      mostrarAlerta(
        'E-mail Enviado',
        `Enviamos as instruções de recuperação de senha para ${emailLimpo}.`
      );
    } finally {
      setSendingReset(false);
    }
  };

  const handleGuestLogin = () => {
    navigation.replace('Inicial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Image
              source={require('../../../assets/logo.png')}
              style={{ width: 140, height: 140, resizeMode: 'contain' }}
            />
          </View>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Faça login para acessar seus dados de saúde.</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail ou Usuário</Text>
            <TextInput
              placeholderTextColor="#6B7280"
              style={styles.input}
              placeholder="Digite seu e-mail (ou admin)"
              value={emailOrCpf}
              onChangeText={setEmailOrCpf}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholderTextColor="#6B7280"
              style={styles.input}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotLinkBtn} onPress={handleOpenRecover}>
              <Text style={styles.forgotLinkText}>Esqueceu sua senha? Recuperar por e-mail</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isGoogleClientConfigured && !request}
          >
            <Image source={require('../../../assets/google-logo.png')} style={{ width: 24, height: 24 }} />
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} activeOpacity={0.8}>
            <Text style={styles.guestButtonText}>Entrar sem Login (Acesso Rápido)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerLinkText}>
              Não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uncFooter} onPress={() => navigation.navigate('SobreUNC')} activeOpacity={0.8}>
            <Text style={styles.uncFooterText}>Projeto de Curricularização • UNC</Text>
            <Text style={styles.uncFooterLink}>Serviços das Clínicas-Escola à Comunidade →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
              Digite o e-mail cadastrado para receber o link de redefinição de senha.
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
