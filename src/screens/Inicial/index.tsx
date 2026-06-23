import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { styles } from './styles';

type TelaInicialNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Inicial'>;

interface Props {
  navigation: TelaInicialNavigationProp;
}

const { width } = Dimensions.get('window');

export default function TelaInicial({ navigation }: Props) {
  const { perfil } = useStore();
  const userName = perfil?.nome || 'Paciente';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image source={require('../../../assets/logo.png')} style={{ width: 80, height: 80, borderRadius: 16 }} />
          </View>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Olá, {userName}!</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Configuracoes')}>
              {perfil?.fotoUri ? (
                <Image source={{ uri: perfil.fotoUri }} style={{ width: 44, height: 44, borderRadius: 22 }} />
              ) : (
                <Ionicons name="settings-sharp" size={28} color="#999" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Como você está se sentindo hoje?</Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#0d6efd' }]} 
            onPress={() => navigation.navigate('Humor')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="brain" size={48} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Saúde Mental</Text>
            <Text style={styles.courseTag}>Psicologia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#dc3545' }]} 
            onPress={() => navigation.navigate('SinaisVitais')}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="heartbeat" size={48} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Sinais Vitais</Text>
            <Text style={styles.courseTag}>Enfermagem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#28a745' }]} 
            onPress={() => navigation.navigate('Lembretes')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pill" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Lembretes</Text>
            <Text style={styles.courseTag}>Farmácia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#ffc107' }]} 
            onPress={() => navigation.navigate('Perfil')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="run" size={54} color="#333" style={[styles.icon, { color: '#333' }]} />
            <Text style={[styles.cardText, { color: '#333' }]}>Corpo & Movimento</Text>
            <Text style={[styles.courseTag, { color: 'rgba(51, 51, 51, 0.7)' }]}>Educação Física & Fisioterapia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


