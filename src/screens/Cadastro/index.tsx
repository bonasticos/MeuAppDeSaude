import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const { updatePerfil } = useStore();
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!emailOrCpf || !phone || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Salva os dados de perfil
    updatePerfil({ telefone: phone });

    Alert.alert('Sucesso', 'Cadastro realizado!', [
      { text: 'OK', onPress: () => navigation.navigate('Perfil') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={{ width: 100, height: 100, resizeMode: 'contain' }} 
          />
        </View>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>E-mail ou CPF</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Seu e-mail ou CPF"
            value={emailOrCpf}
            onChangeText={setEmailOrCpf}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="(11) 99999-9999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Crie uma senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Repita a senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>Já tem uma conta? <Text style={styles.boldText}>Faça Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


