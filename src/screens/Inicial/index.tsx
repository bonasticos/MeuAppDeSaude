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
          <View style={styles.headerTop}>
            <Text style={styles.title}>Olá, {userName}!</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Configuracoes')}>
              {perfil?.fotoUri ? (
                <Image source={{ uri: perfil.fotoUri }} style={{ width: 44, height: 44, borderRadius: 22 }} />
              ) : (
                <Ionicons name="settings-sharp" size={28} color="#374151" />
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
            <Text style={[styles.cardText, { color: '#1F2937' }]}>Corpo & Movimento</Text>
            <Text style={[styles.courseTag, { color: '#1F2937' }]}>Educação Física & Fisioterapia</Text>
          </TouchableOpacity>
        </View>

        {/* Card Institucional / Propaganda UNC (About Us) */}
        <TouchableOpacity
          style={styles.uncPromoCard}
          onPress={() => navigation.navigate('SobreUNC')}
          activeOpacity={0.88}
        >
          <View style={styles.uncPromoCircle}>
            <Text style={styles.uncWatermark}>UNC</Text>
          </View>
          <Text style={styles.uncPromoEyebrow}>A UNC NA SUA MÃO • SERVIÇOS À COMUNIDADE</Text>
          <Text style={styles.uncPromoTitle}>Clínicas-escola e serviços da UNC.</Text>
          <Text style={styles.uncPromoDesc}>
            Confira os atendimentos prestados à comunidade pelos cursos de saúde, contatos de agendamento e rotas por GPS.
          </Text>
          <View style={styles.uncPromoCtaRow}>
            <Text style={styles.uncPromoCtaText}>Ver Serviços da UNC</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


