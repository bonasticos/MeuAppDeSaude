import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Linking, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';

type SobreUNCNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SobreUNC'>;

interface Props {
  navigation: SobreUNCNavigationProp;
}

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  details: string;
  url: string;
}

const UNC_SITE_URL = 'https://www.unc.br/';

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'eng-software',
    title: 'Engenharia de Software',
    subtitle: 'Formação prática, apps reais e inovação',
    icon: 'code-slash-outline',
    details:
      'O curso de Engenharia de Software da UNC une teoria e prática desde as primeiras fases, desenvolvendo sistemas reais em parceria com a comunidade e outros cursos da universidade.',
    url: 'https://www.unc.br/',
  },
  {
    id: 'clinicas',
    title: 'Clínicas-escola',
    subtitle: 'Atendimentos de saúde para a comunidade',
    icon: 'heart-outline',
    details:
      'As clínicas-escola da UNC aproximam ensino e cuidado à população em áreas como Psicologia, Enfermagem, Farmácia, Educação Física e Fisioterapia.',
    url: 'https://www.unc.br/',
  },
  {
    id: 'cursos',
    title: 'Cursos e inscrições',
    subtitle: 'Graduação, pós-graduação e extensão',
    icon: 'book-outline',
    details:
      'Conheça os cursos de graduação, pós-graduação, editais de ingresso e oportunidades de formação em todos os campi da Universidade do Contestado.',
    url: 'https://www.unc.br/',
  },
  {
    id: 'extensao',
    title: 'Projetos de extensão',
    subtitle: 'Universidade conectada à região',
    icon: 'flask-outline',
    details:
      'Este aplicativo nasceu como um projeto integrador e de extensão universitária para levar acompanhamento de saúde acessível — inclusive para idosos — a toda a região.',
    url: 'https://www.unc.br/',
  },
  {
    id: 'bolsas',
    title: 'Bolsas e oportunidades',
    subtitle: 'Editais, estágios e pesquisa',
    icon: 'briefcase-outline',
    details:
      'Acompanhe programas de bolsas de estudo, iniciação científica, monitorias e vagas de estágio disponíveis para acadêmicos da UNC.',
    url: 'https://www.unc.br/',
  },
  {
    id: 'portal',
    title: 'Portal Acadêmico',
    subtitle: 'Serviços digitais e vida acadêmica',
    icon: 'school-outline',
    details:
      'Acesse o portal oficial da Universidade do Contestado para informações acadêmicas, biblioteca digital e comunicados institucionais.',
    url: 'https://www.unc.br/',
  },
];

const CURSOS_PARCEIROS = [
  'Engenharia de Software',
  'Psicologia',
  'Enfermagem',
  'Farmácia',
  'Educação Física',
  'Fisioterapia',
];

export default function TelaSobreUNC({ navigation }: Props) {
  const [selectedItem, setSelectedItem] = useState<QuickAccessItem | null>(null);

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Site da UNC', `Acesse pelo navegador: ${url}`);
      }
    } catch {
      Alert.alert('Site da UNC', `Acesse pelo navegador: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho Institucional */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backIconBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#0F2942" />
          </TouchableOpacity>

          <View style={styles.brandHeader}>
            <View style={styles.brandBadge}>
              <Ionicons name="school" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>UNIVERSIDADE DO CONTESTADO</Text>
              <Text style={styles.brandSub}>Sobre Nós & Ecossistema UNC</Text>
            </View>
          </View>

          <View style={styles.coursePill}>
            <Text style={styles.coursePillText}>UNC</Text>
          </View>
        </View>

        {/* Banner Hero Institucional */}
        <View style={styles.heroCard}>
          <View style={styles.heroCircleTop} />
          <View style={styles.heroCircleBottom} />

          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons name="creation" size={22} color="#FFFFFF" />
          </View>

          <Text style={styles.heroEyebrow}>ENGENHARIA DE SOFTWARE • UNC</Text>
          <Text style={styles.heroTitle}>A UNC faz parte da cidade. E agora, do seu cuidado diário.</Text>
          <Text style={styles.heroDescription}>
            Aplicativo desenvolvido por acadêmicos do curso de Engenharia de Software da Universidade do Contestado,
            unindo tecnologia e saúde para toda a comunidade.
          </Text>

          <TouchableOpacity style={styles.heroCta} onPress={() => openUrl(UNC_SITE_URL)} activeOpacity={0.85}>
            <Text style={styles.heroCtaText}>Conheça a Universidade</Text>
            <Ionicons name="arrow-forward" size={18} color="#0F2942" />
          </TouchableOpacity>
        </View>

        {/* Sobre o Projeto (About Us) */}
        <Text style={styles.sectionTitle}>Sobre o MeuAppDeSaúde</Text>
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <View style={styles.aboutIconCircle}>
              <Ionicons name="people-outline" size={22} color="#103457" />
            </View>
            <Text style={styles.aboutTitle}>Projeto Acadêmico Multidisciplinar</Text>
          </View>
          <Text style={styles.aboutText}>
            O MeuAppDeSaúde foi idealizado para aproximar tecnologia acessível (pensada também para o público idoso) do
            acompanhamento preventivo de saúde. O desenvolvimento é conduzido pelos alunos de Engenharia de Software da
            UNC em integração com os cursos da área da saúde:
          </Text>
          <View style={styles.tagRow}>
            {CURSOS_PARCEIROS.map((curso) => (
              <View key={curso} style={styles.chip}>
                <Text style={styles.chipText}>{curso}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Acesso rápido UNC */}
        <Text style={styles.sectionTitle}>Acesso rápido UNC</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickCard}
              onPress={() => setSelectedItem(item)}
              activeOpacity={0.8}
            >
              <View>
                <View style={styles.quickIconBox}>
                  <Ionicons name={item.icon} size={22} color="#194B7D" />
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#194B7D" style={styles.quickArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Verde de Impacto Regional */}
        <View style={styles.impactCard}>
          <View style={styles.impactIconBox}>
            <Ionicons name="heart-half-outline" size={22} color="#166534" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactEyebrow}>IMPACTO NA REGIÃO</Text>
            <Text style={styles.impactTitle}>UNC e comunidade</Text>
            <Text style={styles.impactText}>
              Clínicas-escola, projetos de extensão e o curso de Engenharia de Software aproximam ensino, inovação e
              atendimento em saúde à população.
            </Text>
          </View>
        </View>

        {/* Construção colaborativa entre fases */}
        <Text style={styles.sectionTitle}>Construído entre fases na UNC</Text>
        <View style={styles.phasesCard}>
          <View style={styles.phaseItem}>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseBadgeText}>1ª / 2ª Fase</Text>
            </View>
            <Text style={styles.phaseDesc}>
              Levantamento de requisitos junto aos cursos de saúde, design acessível e construção de novas telas e
              modais.
            </Text>
          </View>

          <View style={styles.phaseItem}>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseBadgeText}>3ª / 4ª Fase</Text>
            </View>
            <Text style={styles.phaseDesc}>
              Modelagem de dados, gerenciamento de estado offline-first, questionários clínicos e visualização gráfica.
            </Text>
          </View>

          <View style={[styles.phaseItem, { marginBottom: 0 }]}>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseBadgeText}>5ª / 6ª Fase</Text>
            </View>
            <Text style={styles.phaseDesc}>
              Arquitetura base em React Native & Expo, integração em nuvem com Supabase, segurança LGPD e revisão técnica.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de detalhes dos cards UNC */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalBody}>{selectedItem?.details}</Text>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                const url = selectedItem?.url || UNC_SITE_URL;
                setSelectedItem(null);
                openUrl(url);
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Acessar site oficial da UNC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedItem(null)}>
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

