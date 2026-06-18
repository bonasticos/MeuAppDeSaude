import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { styles } from './styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');

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

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerLinkText}>Não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
