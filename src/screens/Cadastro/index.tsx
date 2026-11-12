import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { salvarPerfil } from '../../services/db';
import { styles } from './styles';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const { updatePerfil } = useStore();
  const [nome, setNome] = useState('');
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const mostrarAlerta = (titulo: string, mensagem: string, onOk?: () => void) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${titulo}\n\n${mensagem}`);
      if (onOk) onOk();
      return;
    }

    Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: onOk }]);
  };

  const handleRegister = async () => {
    if (!emailOrCpf.trim() || !phone.trim() || !password || !confirmPassword) {
      mostrarAlerta('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlerta('Erro', 'As senhas não coincidem.');
      return;
    }

    if (isSupabaseConfigured) {
      const emailLimpo = emailOrCpf.trim();
      if (!emailLimpo.includes('@')) {
        mostrarAlerta('Atenção', 'Para criar uma conta conectada ao Supabase, informe um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        mostrarAlerta('Atenção', 'A senha deve possuir no mínimo 6 caracteres.');
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpo,
          password,
          options: {
            data: {
              nome: nome.trim() || undefined,
              telefone: phone.trim(),
            },
          },
        });

        if (error) {
          mostrarAlerta('Erro no Cadastro', error.message);
          return;
        }

        const perfilInicial = {
          nome: nome.trim(),
          telefone: phone.trim(),
          fotoUri: null,
        };

        updatePerfil(perfilInicial);

        if (data.user && data.session) {
          try {
            await salvarPerfil(data.user.id, perfilInicial);
          } catch (syncError) {
            console.warn('Não foi possível criar o perfil inicial na nuvem agora:', syncError);
          }
          mostrarAlerta('Sucesso', 'Cadastro realizado e perfil inicial criado!', () =>
            navigation.navigate('Perfil')
          );
        } else {
          mostrarAlerta(
            'Confirme seu E-mail',
            'Conta criada! Verifique sua caixa de entrada para confirmar o cadastro e depois faça login.',
            () => navigation.replace('Login')
          );
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Modo local / demonstração offline
    updatePerfil({
      ...(nome.trim() ? { nome: nome.trim() } : {}),
      telefone: phone.trim(),
    });

    mostrarAlerta('Sucesso', 'Cadastro realizado no modo local!', () => navigation.navigate('Perfil'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.topBackBtn}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Voltar"
      >
        <Ionicons name="arrow-back" size={28} color="#1F2937" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={require('../../../assets/logo.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </View>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>E-mail ou CPF *</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="Seu e-mail (ex: nome@email.com)"
            value={emailOrCpf}
            onChangeText={setEmailOrCpf}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="(11) 99999-9999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Senha *</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmar Senha *</Text>
          <TextInput
            placeholderTextColor="#6B7280"
            style={styles.input}
            placeholder="Repita a senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>
            Já tem uma conta? <Text style={styles.boldText}>Faça Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
