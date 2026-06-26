import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../services/firebase';
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
    clientId: 'SEU_CLIENT_ID_WEB.apps.googleusercontent.com', // TODO: Preencher com as credenciais do Google Cloud
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace('Inicial');
        })
        .catch((error) => {
          Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
          console.error(error);
        });
    }
  }, [response]);

  const handleLogin = () => {
    if (!emailOrCpf || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    if (emailOrCpf.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
      navigation.replace('Inicial');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas. Use admin/admin para entrar.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
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

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerLinkText}>Não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


