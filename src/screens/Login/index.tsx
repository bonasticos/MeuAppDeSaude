import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

WebBrowser.maybeCompleteAuthSession();
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'SEU_CLIENT_ID_WEB.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      supabase.auth
        .signInWithIdToken({
          provider: 'google',
          token: id_token,
        })
        .then(({ error }) => {
          if (error) {
            Alert.alert('Erro', 'Não foi possível fazer login com o Google no Supabase.');
            console.error(error);
            return;
          }
          navigation.replace('Inicial');
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!emailOrCpf || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    // Modo demonstração local (admin/admin) continua funcionando para testes rápidos
    if (emailOrCpf.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
      navigation.replace('Inicial');
      return;
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailOrCpf.trim(),
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Erro de Autenticação', error.message);
        return;
      }

      navigation.replace('Inicial');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas. Use admin/admin para entrar ou configure o Supabase no arquivo .env.');
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
            <Text style={styles.label}>E-mail ou CPF</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Digite seu e-mail ou CPF"
              value={emailOrCpf}
              onChangeText={setEmailOrCpf}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput placeholderTextColor="#999"
              style={styles.input}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Image source={require('../../../assets/google-logo.png')} style={{ width: 24, height: 24 }} />
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.guestButton} 
            onPress={handleGuestLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>Entrar sem Login (Acesso Rápido)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerLinkText}>Não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uncFooter} onPress={() => navigation.navigate('SobreUNC')} activeOpacity={0.8}>
            <Text style={styles.uncFooterText}>Desenvolvido por Engenharia de Software • UNC</Text>
            <Text style={styles.uncFooterLink}>Conheça a Universidade e o Projeto →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


