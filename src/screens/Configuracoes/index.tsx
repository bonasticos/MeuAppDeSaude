import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type ConfiguracoesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracoes'>;

interface Props {
  navigation: ConfiguracoesScreenNavigationProp;
}

export default function TelaConfiguracoes({ navigation }: Props) {
  const { perfil, updatePerfil } = useStore();
  
  const [nome, setNome] = useState(perfil?.nome || '');
  const [telefone, setTelefone] = useState(perfil?.telefone || '');
  const [fotoUri, setFotoUri] = useState<string | null>(perfil?.fotoUri || null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('PermissÃ£o Negada', 'Precisamos de permissÃ£o para acessar sua galeria.');
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

  const handleSave = () => {
    updatePerfil({ nome, telefone, fotoUri });
    Alert.alert('Sucesso', 'ConfiguraÃ§Ãµes salvas com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleRecoverPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Um e-mail com as instruÃ§Ãµes para redefiniÃ§Ã£o de senha foi enviado para o seu endereÃ§o cadastrado.',
      [{ text: 'Entendi' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>ConfiguraÃ§Ãµes</Text>

        <TouchableOpacity style={styles.photoContainer} onPress={handlePickImage}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color="#999" />
            </View>
          )}
          <Text style={styles.changePhotoText}>Alterar Foto</Text>
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput placeholderTextColor="#999"
            style={styles.input}
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar AlteraÃ§Ãµes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recoverButton} onPress={handleRecoverPassword}>
          <Text style={styles.recoverButtonText}>Recuperar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


