import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Branco/cinza suave para não cegar
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  settingsButton: {
    backgroundColor: '#e9ecef',
    padding: 10,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // 48% width leaves a 4% gap (half of the previous 8% gap)
    aspectRatio: 1, // Mantém o botão quadrado e se adapta a qualquer tela Android
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // Metade do espaçamento vertical também
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  icon: {
    marginBottom: 12,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseTag: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
  uncPromoCard: {
    backgroundColor: '#103457',
    borderRadius: 22,
    padding: 22,
    marginTop: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  uncPromoCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(56, 130, 200, 0.28)',
    right: -28,
    bottom: -36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncWatermark: {
    fontSize: 34,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.28)',
    letterSpacing: 1,
    marginRight: 16,
    marginBottom: 16,
  },
  uncPromoEyebrow: {
    fontSize: 13,
    fontWeight: '800',
    color: '#BAE6FD',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  uncPromoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 8,
    maxWidth: '85%',
  },
  uncPromoDesc: {
    fontSize: 16,
    color: '#F1F5F9',
    lineHeight: 22,
    marginBottom: 16,
    maxWidth: '85%',
  },
  uncPromoCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  uncPromoCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

