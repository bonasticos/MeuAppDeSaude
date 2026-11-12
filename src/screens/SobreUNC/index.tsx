import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';
import {
  ACESSO_RAPIDO_UNC,
  CAMPI_UNC,
  CLINICA_ESCOLA_GERAL,
  CURSOS_SAUDE_UNC,
  CampusUNC,
  CursoClinicaInfo,
  UNC_SITE_URL,
} from './uncData';

type SobreUNCNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SobreUNC'>;

interface Props {
  navigation: SobreUNCNavigationProp;
}

interface UserCoords {
  lat: number;
  lng: number;
}

const CURSOS_PARCEIROS = [
  'Engenharia de Software',
  'Medicina',
  'Fisioterapia',
  'Odontologia',
  'Psicologia',
  'Enfermagem',
];

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TelaSobreUNC({ navigation }: Props) {
  const [selectedInfo, setSelectedInfo] = useState<CursoClinicaInfo | null>(null);
  const [modalTab, setModalTab] = useState<'curso' | 'clinica' | 'gps'>('curso');
  const [selectedCampusMap, setSelectedCampusMap] = useState<CampusUNC | null>(null);

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const openInfoWindow = (item: CursoClinicaInfo, initialTab: 'curso' | 'clinica' | 'gps' = 'curso') => {
    setSelectedInfo(item);
    setModalTab(initialTab);
  };

  // Abre em uma janela separada (Web popup) ou janela in-app (Mobile) ao invés de trocar a aba atual
  const openInSeparateWindow = async (url: string) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const popup = window.open(
          url,
          'UNCJanelaOficial',
          'width=1020,height=740,menubar=no,toolbar=no,location=yes,resizable=yes,scrollbars=yes'
        );
        if (popup) {
          popup.focus();
          return;
        }
      }
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert('Portal da UNC', `Acesse: ${url}`);
    }
  };

  const handleGetGpsLocation = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Permissão de localização GPS negada. Você ainda pode ver todos os endereços e abrir as rotas.');
        setGpsLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (err) {
      setGpsError('Não foi possível obter o GPS agora. Verifique se a localização está ativada no dispositivo.');
    } finally {
      setGpsLoading(false);
    }
  };

  const campiOrdenados = useMemo(() => {
    const withDist = CAMPI_UNC.map((campus) => ({
      ...campus,
      distanciaKm: userCoords
        ? calcularDistanciaKm(userCoords.lat, userCoords.lng, campus.lat, campus.lng)
        : null,
    }));

    if (userCoords) {
      withDist.sort((a, b) => (a.distanciaKm ?? 99999) - (b.distanciaKm ?? 99999));
    }
    return withDist;
  }, [userCoords]);

  const abrirRotaGps = async (campus: CampusUNC) => {
    const label = encodeURIComponent(`UNC - ${campus.nome}`);
    const webDirectionsUrl = userCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${campus.lat},${campus.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${campus.lat},${campus.lng}`;

    try {
      if (Platform.OS === 'android') {
        const geoUrl = `geo:${campus.lat},${campus.lng}?q=${campus.lat},${campus.lng}(${label})`;
        const canGeo = await Linking.canOpenURL(geoUrl);
        if (canGeo) {
          await Linking.openURL(geoUrl);
          return;
        }
      } else if (Platform.OS === 'ios') {
        const appleUrl = `http://maps.apple.com/?daddr=${campus.lat},${campus.lng}&q=${label}`;
        const canApple = await Linking.canOpenURL(appleUrl);
        if (canApple) {
          await Linking.openURL(appleUrl);
          return;
        }
      }

      await openInSeparateWindow(webDirectionsUrl);
    } catch {
      Alert.alert('GPS', `Coordenadas: ${campus.lat}, ${campus.lng}\n${campus.endereco}`);
    }
  };

  const ligarTelefone = async (telefoneTexto: string) => {
    const firstPhone = telefoneTexto.split('/')[0].replace(/[^\d]/g, '');
    if (!firstPhone) return;
    try {
      await Linking.openURL(`tel:${firstPhone}`);
    } catch {
      Alert.alert('Telefone UNC', telefoneTexto);
    }
  };

  const campiDoItemSelecionado = useMemo(() => {
    if (!selectedInfo) return [];
    return campiOrdenados.filter((c) => selectedInfo.campiIds.includes(c.id));
  }, [selectedInfo, campiOrdenados]);

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
              <Text style={styles.brandSub}>Clínicas-Escola, Cursos & Sobre Nós</Text>
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
            Desenvolvido por acadêmicos de Engenharia de Software da Universidade do Contestado, conectando tecnologia,
            clínicas-escola e os cursos da saúde com toda a comunidade.
          </Text>

          <View style={styles.heroCtaRow}>
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => openInSeparateWindow(UNC_SITE_URL)}
              activeOpacity={0.85}
            >
              <Text style={styles.heroCtaText}>Site da UNC (Janela)</Text>
              <Ionicons name="open-outline" size={17} color="#0F2942" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroCtaSecondary}
              onPress={() => openInfoWindow(CLINICA_ESCOLA_GERAL, 'clinica')}
              activeOpacity={0.85}
            >
              <Ionicons name="medkit-outline" size={17} color="#FFFFFF" />
              <Text style={styles.heroCtaSecondaryText}>Clínica Escola</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Clínica Escola & Cursos da Saúde */}
        <Text style={styles.sectionTitle}>Clínica Escola & Cursos da Saúde</Text>
        <Text style={styles.sectionHint}>
          Toque em qualquer card para abrir a janela com informações do curso, atendimentos e localização GPS.
        </Text>

        {/* Card Principal Clínica Escola */}
        <TouchableOpacity
          style={styles.clinicFeaturedCard}
          onPress={() => openInfoWindow(CLINICA_ESCOLA_GERAL, 'clinica')}
          activeOpacity={0.85}
        >
          <View style={styles.clinicFeaturedTop}>
            <View style={styles.clinicFeaturedBadge}>
              <Ionicons name="medkit" size={16} color="#166534" />
              <Text style={styles.clinicFeaturedBadgeText}>ATENDIMENTO À COMUNIDADE</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#103457" />
          </View>
          <Text style={styles.clinicFeaturedTitle}>{CLINICA_ESCOLA_GERAL.titulo}</Text>
          <Text style={styles.clinicFeaturedSub}>{CLINICA_ESCOLA_GERAL.subtituloCard}</Text>
          <View style={styles.clinicFeaturedFooter}>
            <Text style={styles.clinicFeaturedPhone}>📞 Espaço Mais Saúde: (47) 3641-5519</Text>
            <Text style={styles.clinicFeaturedLink}>Abrir janela →</Text>
          </View>
        </TouchableOpacity>

        {/* Grid dos Cursos: Medicina, Fisio, Odonto, Psico, Enfermagem + Eng. Software */}
        <View style={styles.grid}>
          {CURSOS_SAUDE_UNC.map((curso) => (
            <TouchableOpacity
              key={curso.id}
              style={styles.quickCard}
              onPress={() => openInfoWindow(curso, 'curso')}
              activeOpacity={0.8}
            >
              <View>
                <View style={[styles.quickIconBox, { backgroundColor: curso.corBadge }]}>
                  <Ionicons
                    name={curso.icone as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={curso.corIcone}
                  />
                </View>
                <Text style={styles.quickTitle}>{curso.titulo}</Text>
                <Text style={styles.quickSub}>{curso.subtituloCard}</Text>
              </View>
              <Ionicons name="open-outline" size={17} color="#194B7D" style={styles.quickArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção Localização por GPS dos Campi & Clínicas */}
        <Text style={styles.sectionTitle}>Localização por GPS — Campi UNC</Text>
        <Text style={styles.sectionHint}>
          Ative seu GPS para calcular a distância até cada campus ou abra o mapa em uma janela sem sair do app.
        </Text>

        <View style={styles.gpsSectionCard}>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={handleGetGpsLocation}
            disabled={gpsLoading}
            activeOpacity={0.85}
          >
            {gpsLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="locate" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.gpsButtonText}>
              {gpsLoading ? 'Localizando via GPS...' : 'Usar meu GPS para encontrar campus mais próximo'}
            </Text>
          </TouchableOpacity>

          {userCoords && (
            <View style={styles.gpsStatusBox}>
              <Text style={styles.gpsStatusText}>
                📍 GPS ativo ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}) — Campi ordenados do mais
                próximo para o mais distante.
              </Text>
            </View>
          )}

          {gpsError && (
            <View style={[styles.gpsStatusBox, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.gpsStatusText, { color: '#991B1B' }]}>{gpsError}</Text>
            </View>
          )}

          {campiOrdenados.map((campus, index) => {
            const isNearest = Boolean(userCoords && index === 0);
            return (
              <View
                key={campus.id}
                style={[styles.campusRowCard, isNearest && styles.campusRowNearest]}
              >
                <View style={styles.campusTopLine}>
                  <Text style={styles.campusName}>{campus.nome}</Text>
                  {campus.distanciaKm !== null ? (
                    <View style={[styles.distancePill, isNearest && styles.distancePillNearest]}>
                      <Text style={[styles.distancePillText, isNearest && styles.distancePillTextNearest]}>
                        {isNearest ? 'Mais próximo • ' : ''}
                        {campus.distanciaKm.toFixed(1)} km
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.distancePill}>
                      <Text style={styles.distancePillText}>{campus.cidade}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.campusAddress}>
                  {campus.endereco} • CEP {campus.cep}
                </Text>
                {campus.destaque && <Text style={styles.campusHighlight}>{campus.destaque}</Text>}

                <View style={styles.campusActionsRow}>
                  <TouchableOpacity
                    style={[styles.campusSmallBtn, styles.campusSmallBtnPrimary]}
                    onPress={() => setSelectedCampusMap(campus)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="map-outline" size={15} color="#FFFFFF" />
                    <Text style={[styles.campusSmallBtnText, styles.campusSmallBtnTextPrimary]}>
                      Ver Mapa (Janela)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.campusSmallBtn}
                    onPress={() => abrirRotaGps(campus)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate-outline" size={15} color="#0F2942" />
                    <Text style={styles.campusSmallBtnText}>Rota GPS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.campusSmallBtn}
                    onPress={() => ligarTelefone(campus.telefone)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call-outline" size={15} color="#0F2942" />
                    <Text style={styles.campusSmallBtnText}>{campus.telefone}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Acesso rápido UNC */}
        <Text style={styles.sectionTitle}>Acesso rápido UNC</Text>
        <View style={styles.grid}>
          {ACESSO_RAPIDO_UNC.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickCard}
              onPress={() => openInfoWindow(item, 'curso')}
              activeOpacity={0.8}
            >
              <View>
                <View style={styles.quickIconBox}>
                  <Ionicons
                    name={item.icone as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color="#194B7D"
                  />
                </View>
                <Text style={styles.quickTitle}>{item.titulo}</Text>
                <Text style={styles.quickSub}>{item.subtituloCard}</Text>
              </View>
              <Ionicons name="open-outline" size={17} color="#194B7D" style={styles.quickArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sobre o Projeto (About Us) */}
        <Text style={styles.sectionTitle}>Sobre o MeuAppDeSaúde</Text>
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <View style={styles.aboutIconCircle}>
              <Ionicons name="people-outline" size={22} color="#103457" />
            </View>
            <Text style={styles.aboutTitle}>Projeto Acadêmico Multidisciplinar UNC</Text>
          </View>
          <Text style={styles.aboutText}>
            O MeuAppDeSaúde nasceu na Universidade do Contestado para unir tecnologia acessível (pensada também para o
            público idoso) ao acompanhamento preventivo de saúde. Desenvolvido pelos alunos de Engenharia de Software em
            parceria com os cursos de saúde da UNC:
          </Text>
          <View style={styles.tagRow}>
            {CURSOS_PARCEIROS.map((curso) => (
              <View key={curso} style={styles.chip}>
                <Text style={styles.chipText}>{curso}</Text>
              </View>
            ))}
          </View>
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

      {/* JANELA MODAL DE DETALHES DO CURSO / CLÍNICA ESCOLA (sem trocar de aba) */}
      <Modal
        visible={selectedInfo !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedInfo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWindow}>
            <View style={styles.modalWindowHeader}>
              <Text style={styles.modalWindowTitle}>{selectedInfo?.titulo}</Text>
              <TouchableOpacity style={styles.modalCloseX} onPress={() => setSelectedInfo(null)}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBodyScroll} showsVerticalScrollIndicator={false}>
              {/* Abas internas da janela */}
              <View style={styles.modalTabBar}>
                <TouchableOpacity
                  style={[styles.modalTabBtn, modalTab === 'curso' && styles.modalTabBtnActive]}
                  onPress={() => setModalTab('curso')}
                >
                  <Text style={[styles.modalTabText, modalTab === 'curso' && styles.modalTabTextActive]}>
                    Informações
                  </Text>
                </TouchableOpacity>

                {selectedInfo?.clinicaEscola && (
                  <TouchableOpacity
                    style={[styles.modalTabBtn, modalTab === 'clinica' && styles.modalTabBtnActive]}
                    onPress={() => setModalTab('clinica')}
                  >
                    <Text style={[styles.modalTabText, modalTab === 'clinica' && styles.modalTabTextActive]}>
                      Clínica Escola
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.modalTabBtn, modalTab === 'gps' && styles.modalTabBtnActive]}
                  onPress={() => setModalTab('gps')}
                >
                  <Text style={[styles.modalTabText, modalTab === 'gps' && styles.modalTabTextActive]}>
                    GPS & Campi
                  </Text>
                </TouchableOpacity>
              </View>

              {modalTab === 'curso' && selectedInfo && (
                <View>
                  {(selectedInfo.duracao || selectedInfo.modalidade || selectedInfo.turno) && (
                    <View style={styles.metaGrid}>
                      {selectedInfo.duracao && (
                        <View style={styles.metaBox}>
                          <Text style={styles.metaLabel}>DURAÇÃO</Text>
                          <Text style={styles.metaValue}>{selectedInfo.duracao}</Text>
                        </View>
                      )}
                      {selectedInfo.modalidade && (
                        <View style={styles.metaBox}>
                          <Text style={styles.metaLabel}>MODALIDADE</Text>
                          <Text style={styles.metaValue}>{selectedInfo.modalidade}</Text>
                        </View>
                      )}
                      {selectedInfo.turno && (
                        <View style={styles.metaBox}>
                          <Text style={styles.metaLabel}>TURNO</Text>
                          <Text style={styles.metaValue}>{selectedInfo.turno}</Text>
                        </View>
                      )}
                      <View style={styles.metaBox}>
                        <Text style={styles.metaLabel}>CAMPI</Text>
                        <Text style={styles.metaValue}>{selectedInfo.campiResumo}</Text>
                      </View>
                    </View>
                  )}

                  <Text style={styles.modalSubheading}>Objetivos e Proposta na UNC</Text>
                  <Text style={styles.modalParagraph}>{selectedInfo.objetivos}</Text>

                  <Text style={styles.modalSubheading}>Perfil do Egresso</Text>
                  <Text style={styles.modalParagraph}>{selectedInfo.perfilEgresso}</Text>

                  <Text style={styles.modalSubheading}>Áreas de Atuação e Destaques</Text>
                  {selectedInfo.areasAtuacao.map((area, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{area}</Text>
                    </View>
                  ))}
                </View>
              )}

              {modalTab === 'clinica' && selectedInfo?.clinicaEscola && (
                <View>
                  <View style={styles.clinicBoxInModal}>
                    <Text style={[styles.modalSubheading, { marginTop: 0, color: '#166534' }]}>
                      {selectedInfo.clinicaEscola.titulo}
                    </Text>
                    <Text style={styles.modalParagraph}>{selectedInfo.clinicaEscola.descricao}</Text>
                    <Text style={styles.modalSubheading}>Como Agendar / Atendimento</Text>
                    <Text style={[styles.modalParagraph, { marginBottom: 8 }]}>
                      {selectedInfo.clinicaEscola.comoAgendar}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F2942' }}>
                      📞 Contato: {selectedInfo.clinicaEscola.contato}
                    </Text>
                    {selectedInfo.clinicaEscola.email && (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#194B7D', marginTop: 4 }}>
                        ✉️ E-mail: {selectedInfo.clinicaEscola.email}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.modalPrimaryBtn, { backgroundColor: '#166534' }]}
                    onPress={() => ligarTelefone(selectedInfo.clinicaEscola!.contato)}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                    <Text style={styles.modalPrimaryBtnText}>Ligar para Agendamento</Text>
                  </TouchableOpacity>
                </View>
              )}

              {modalTab === 'gps' && (
                <View>
                  {!userCoords && (
                    <TouchableOpacity
                      style={[styles.gpsButton, { marginBottom: 12 }]}
                      onPress={handleGetGpsLocation}
                      disabled={gpsLoading}
                    >
                      <Ionicons name="locate" size={18} color="#FFFFFF" />
                      <Text style={styles.gpsButtonText}>
                        {gpsLoading ? 'Localizando...' : 'Calcular distância com meu GPS'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {campiDoItemSelecionado.map((campus) => (
                    <View key={campus.id} style={styles.campusRowCard}>
                      <View style={styles.campusTopLine}>
                        <Text style={styles.campusName}>{campus.nome}</Text>
                        {campus.distanciaKm !== null && (
                          <View style={styles.distancePill}>
                            <Text style={styles.distancePillText}>{campus.distanciaKm.toFixed(1)} km</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.campusAddress}>
                        {campus.endereco} • CEP {campus.cep}
                      </Text>

                      {Platform.OS === 'web' && (
                        <View style={styles.mapFrameContainer}>
                          {React.createElement('iframe', {
                            src: `https://maps.google.com/maps?q=${campus.lat},${campus.lng}&z=16&output=embed`,
                            style: { width: '100%', height: '100%', border: 0 },
                            loading: 'lazy',
                            title: `Mapa ${campus.nome}`,
                          })}
                        </View>
                      )}

                      <View style={styles.campusActionsRow}>
                        <TouchableOpacity
                          style={[styles.campusSmallBtn, styles.campusSmallBtnPrimary]}
                          onPress={() => abrirRotaGps(campus)}
                        >
                          <Ionicons name="navigate" size={15} color="#FFFFFF" />
                          <Text style={[styles.campusSmallBtnText, styles.campusSmallBtnTextPrimary]}>
                            Traçar Rota GPS
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.campusSmallBtn}
                          onPress={() => ligarTelefone(campus.telefone)}
                        >
                          <Ionicons name="call" size={15} color="#0F2942" />
                          <Text style={styles.campusSmallBtnText}>{campus.telefone}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => openInSeparateWindow(selectedInfo?.urlOficial || UNC_SITE_URL)}
              >
                <Ionicons name="open-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Abrir Portal UNC em Nova Janela</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedInfo(null)}>
                <Text style={styles.modalCloseBtnText}>Fechar Janela</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* JANELA MODAL DE MAPA GPS DEDICADA PARA CADA CAMPUS */}
      <Modal
        visible={selectedCampusMap !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCampusMap(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWindow}>
            <View style={styles.modalWindowHeader}>
              <Text style={styles.modalWindowTitle}>{selectedCampusMap?.nome}</Text>
              <TouchableOpacity style={styles.modalCloseX} onPress={() => setSelectedCampusMap(null)}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {selectedCampusMap && (
              <ScrollView style={styles.modalBodyScroll}>
                <Text style={styles.modalSubheading}>Endereço Oficial</Text>
                <Text style={styles.modalParagraph}>
                  {selectedCampusMap.endereco} — CEP {selectedCampusMap.cep}
                </Text>

                <Text style={styles.modalSubheading}>Coordenadas GPS</Text>
                <Text style={styles.modalParagraph}>
                  Latitude: {selectedCampusMap.lat} | Longitude: {selectedCampusMap.lng}
                  {userCoords
                    ? `\nDistância aproximada do seu GPS: ${calcularDistanciaKm(
                        userCoords.lat,
                        userCoords.lng,
                        selectedCampusMap.lat,
                        selectedCampusMap.lng
                      ).toFixed(1)} km`
                    : ''}
                </Text>

                {Platform.OS === 'web' && (
                  <View style={[styles.mapFrameContainer, { height: 280 }]}>
                    {React.createElement('iframe', {
                      src: `https://maps.google.com/maps?q=${selectedCampusMap.lat},${selectedCampusMap.lng}&z=16&output=embed`,
                      style: { width: '100%', height: '100%', border: 0 },
                      loading: 'lazy',
                      title: `Mapa GPS ${selectedCampusMap.nome}`,
                    })}
                  </View>
                )}

                {selectedCampusMap.destaque && (
                  <View style={styles.clinicBoxInModal}>
                    <Text style={[styles.modalSubheading, { marginTop: 0, color: '#166534' }]}>
                      Destaques neste Campus
                    </Text>
                    <Text style={[styles.modalParagraph, { marginBottom: 0 }]}>{selectedCampusMap.destaque}</Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              {selectedCampusMap && (
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => abrirRotaGps(selectedCampusMap)}
                >
                  <Ionicons name="navigate" size={18} color="#FFFFFF" />
                  <Text style={styles.modalPrimaryBtnText}>Iniciar Rota no GPS</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedCampusMap(null)}>
                <Text style={styles.modalCloseBtnText}>Fechar Mapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
