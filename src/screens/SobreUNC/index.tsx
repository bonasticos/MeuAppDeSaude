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
  CAMPI_UNC,
  CLINICA_ESCOLA_GERAL,
  SERVICOS_CURSOS_UNC,
  CampusUNC,
  ServicoCursoInfo,
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
  const [selectedInfo, setSelectedInfo] = useState<ServicoCursoInfo | null>(null);
  const [modalTab, setModalTab] = useState<'servicos' | 'agendamento' | 'gps'>('servicos');
  const [selectedCampusMap, setSelectedCampusMap] = useState<CampusUNC | null>(null);

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const openInfoWindow = (
    item: ServicoCursoInfo,
    initialTab: 'servicos' | 'agendamento' | 'gps' = 'servicos'
  ) => {
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
    } catch {
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
              <Text style={styles.brandSub}>Serviços de Saúde à Comunidade</Text>
            </View>
          </View>

          <View style={styles.coursePill}>
            <Text style={styles.coursePillText}>UNC</Text>
          </View>
        </View>

        {/* Banner Hero — Serviços à Comunidade */}
        <View style={styles.heroCard}>
          <View style={styles.heroCircleTop} />
          <View style={styles.heroCircleBottom} />

          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons name="hand-heart-outline" size={22} color="#FFFFFF" />
          </View>

          <Text style={styles.heroEyebrow}>CLÍNICAS-ESCOLA & ATENDIMENTOS • UNC</Text>
          <Text style={styles.heroTitle}>Serviços gratuitos e acessíveis para cuidar da comunidade.</Text>
          <Text style={styles.heroDescription}>
            Confira os atendimentos prestados à população pelos cursos da saúde da UNC — consultas, reabilitação,
            odontologia, psicologia e enfermagem — com telefones e localização por GPS.
          </Text>

          <View style={styles.heroCtaRow}>
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => openInfoWindow(CLINICA_ESCOLA_GERAL, 'agendamento')}
              activeOpacity={0.85}
            >
              <Ionicons name="medkit-outline" size={17} color="#0F2942" />
              <Text style={styles.heroCtaText}>Como Agendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroCtaSecondary}
              onPress={() => openInSeparateWindow(UNC_SITE_URL)}
              activeOpacity={0.85}
            >
              <Text style={styles.heroCtaSecondaryText}>Portal UNC</Text>
              <Ionicons name="open-outline" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Clínica Escola & Serviços por Curso */}
        <Text style={styles.sectionTitle}>Serviços por Área à Comunidade</Text>
        <Text style={styles.sectionHint}>
          Toque em uma área para ver os serviços oferecidos à população, contatos de agendamento e rotas no GPS.
        </Text>

        {/* Card Principal Clínica Escola / Espaço Mais Saúde */}
        <TouchableOpacity
          style={styles.clinicFeaturedCard}
          onPress={() => openInfoWindow(CLINICA_ESCOLA_GERAL, 'servicos')}
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
            <Text style={styles.clinicFeaturedLink}>Ver serviços →</Text>
          </View>
        </TouchableOpacity>

        {/* Grid de Serviços à Comunidade: Medicina, Fisio, Odonto, Psico e Enfermagem */}
        <View style={styles.grid}>
          {SERVICOS_CURSOS_UNC.map((servico) => (
            <TouchableOpacity
              key={servico.id}
              style={styles.quickCard}
              onPress={() => openInfoWindow(servico, 'servicos')}
              activeOpacity={0.8}
            >
              <View>
                <View style={[styles.quickIconBox, { backgroundColor: servico.corBadge }]}>
                  <Ionicons
                    name={servico.icone as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={servico.corIcone}
                  />
                </View>
                <Text style={styles.quickTitle}>{servico.titulo}</Text>
                <Text style={styles.quickSub}>{servico.subtituloCard}</Text>
              </View>
              <Ionicons name="open-outline" size={17} color="#194B7D" style={styles.quickArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção Localização por GPS dos Campi & Clínicas */}
        <Text style={styles.sectionTitle}>Localização por GPS — Campi UNC</Text>
        <Text style={styles.sectionHint}>
          Ative seu GPS para encontrar a unidade mais próxima de você e abrir o mapa ou rota até o atendimento.
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

        {/* Card Verde de Impacto Regional */}
        <View style={styles.impactCard}>
          <View style={styles.impactIconBox}>
            <Ionicons name="heart-half-outline" size={22} color="#166534" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactEyebrow}>ATENDIMENTO SUPERVISADO</Text>
            <Text style={styles.impactTitle}>UNC próxima da população</Text>
            <Text style={styles.impactText}>
              Os atendimentos nas clínicas-escola são conduzidos sob supervisão docente, levando saúde preventiva,
              reabilitação e acolhimento para toda a região.
            </Text>
          </View>
        </View>

        {/* Nota objetiva sobre o aplicativo */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <View style={styles.aboutIconCircle}>
              <Ionicons name="phone-portrait-outline" size={22} color="#103457" />
            </View>
            <Text style={styles.aboutTitle}>Sobre este Aplicativo</Text>
          </View>
          <Text style={[styles.aboutText, { marginBottom: 0 }]}>
            Este aplicativo foi criado como um projeto de curricularização da extensão no curso de Engenharia de Software
            da UNC, com o objetivo de facilitar o cuidado diário com a saúde e aproximar a comunidade dos serviços
            prestados pelas clínicas-escola da universidade.
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* JANELA MODAL DE DETALHES DOS SERVIÇOS À COMUNIDADE (sem trocar de aba) */}
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
                  style={[styles.modalTabBtn, modalTab === 'servicos' && styles.modalTabBtnActive]}
                  onPress={() => setModalTab('servicos')}
                >
                  <Text style={[styles.modalTabText, modalTab === 'servicos' && styles.modalTabTextActive]}>
                    Serviços
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalTabBtn, modalTab === 'agendamento' && styles.modalTabBtnActive]}
                  onPress={() => setModalTab('agendamento')}
                >
                  <Text style={[styles.modalTabText, modalTab === 'agendamento' && styles.modalTabTextActive]}>
                    Agendamento
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalTabBtn, modalTab === 'gps' && styles.modalTabBtnActive]}
                  onPress={() => setModalTab('gps')}
                >
                  <Text style={[styles.modalTabText, modalTab === 'gps' && styles.modalTabTextActive]}>
                    GPS & Campi
                  </Text>
                </TouchableOpacity>
              </View>

              {modalTab === 'servicos' && selectedInfo && (
                <View>
                  <View style={styles.metaGrid}>
                    <View style={styles.metaBox}>
                      <Text style={styles.metaLabel}>PÚBLICO ATENDIDO</Text>
                      <Text style={styles.metaValue}>{selectedInfo.publicoAlvo}</Text>
                    </View>
                    <View style={styles.metaBox}>
                      <Text style={styles.metaLabel}>UNIDADES COM ATENDIMENTO</Text>
                      <Text style={styles.metaValue}>{selectedInfo.campiResumo}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalSubheading}>Como funciona o atendimento</Text>
                  <Text style={styles.modalParagraph}>{selectedInfo.descricaoAtendimento}</Text>

                  <Text style={styles.modalSubheading}>Serviços prestados à comunidade</Text>
                  {selectedInfo.servicosComunidade.map((item, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {modalTab === 'agendamento' && selectedInfo && (
                <View>
                  <View style={styles.clinicBoxInModal}>
                    <Text style={[styles.modalSubheading, { marginTop: 0, color: '#166534' }]}>
                      {selectedInfo.clinicaEscola.titulo}
                    </Text>
                    <Text style={styles.modalParagraph}>{selectedInfo.clinicaEscola.descricao}</Text>
                    <Text style={styles.modalSubheading}>Como solicitar atendimento</Text>
                    <Text style={[styles.modalParagraph, { marginBottom: 8 }]}>
                      {selectedInfo.clinicaEscola.comoAgendar}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F2942' }}>
                      📞 Contato: {selectedInfo.clinicaEscola.contato}
                    </Text>
                    {selectedInfo.clinicaEscola.email && (
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#194B7D', marginTop: 4 }}>
                        ✉️ E-mail: {selectedInfo.clinicaEscola.email}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.modalPrimaryBtn, { backgroundColor: '#166534' }]}
                    onPress={() => ligarTelefone(selectedInfo.clinicaEscola.contato)}
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
                      Serviços nesta Unidade
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
