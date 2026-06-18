import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useEstadoGlobal } from '../../armazenamento/estadoGlobal';
import { styles } from './styles';

type TelaInicialNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Inicial'>;

interface Props {
  navigation: TelaInicialNavigationProp;
}

const { width } = Dimensions.get('window');

export default function TelaInicial({ navigation }: Props) {
  const { perfil } = useEstadoGlobal();
  const userName = perfil?.nome || 'Paciente';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
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
            <Text style={styles.emoji}>😊</Text>
            <Text style={styles.cardText}>Humor & Atividade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#dc3545' }]} 
            onPress={() => navigation.navigate('SinaisVitais')}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="heartbeat" size={48} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Sinais Vitais (BPM/ Glicose/ Pressão)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#28a745' }]} 
            onPress={() => navigation.navigate('Lembretes')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="clock-outline" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Meus Lembretes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#17a2b8' }]} 
            onPress={() => navigation.navigate('Perfil')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="scale-bathroom" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Ver Meu IMC</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#fd7e14' }]} 
            onPress={() => navigation.navigate('Farmacia')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pill" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Farmácia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#6f42c1' }]} 
            onPress={() => navigation.navigate('Enfermagem')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="stethoscope" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Enfermagem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#28a745' }]} 
            onPress={() => navigation.navigate('EducacaoFisica')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="run" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Ed. Física</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#17a2b8' }]} 
            onPress={() => navigation.navigate('Psicologia')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="brain" size={54} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>Psicologia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#ffc107' }]} 
            onPress={() => navigation.navigate('Fisioterapia')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="human-handsup" size={54} color="#333" style={[styles.icon, { color: '#333' }]} />
            <Text style={[styles.cardText, { color: '#333' }]}>Fisioterapia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
