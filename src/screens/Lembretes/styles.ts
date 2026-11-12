import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 22,
  },

  // Abas Principais (Alarmes vs Estoque Médico)
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  tabTextActive: {
    color: '#0056B3',
  },

  // Filtros de Lembretes (Sub-filtros: Todos, Remédios, Ações)
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  filterTabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
  },
  filterTabTextActive: {
    color: '#0E7490',
  },

  // Layout Geral da Lista
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Estilos de Lembretes
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  completedCard: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  remedioCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#0056B3',
  },
  acaoCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#15803D',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#4B5563',
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  remedioBadge: {
    backgroundColor: '#DBEAFE',
  },
  acaoBadge: {
    backgroundColor: '#DCFCE7',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  remedioBadgeText: {
    color: '#1E40AF',
  },
  acaoBadgeText: {
    color: '#166534',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#374151',
    marginTop: 4,
    lineHeight: 22,
  },
  cardNotes: {
    fontSize: 15,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  cardActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 10,
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  editButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  checkButtonActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 10,
  },

  // Botões de Estoque Médico (Farmácia)
  rowButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  pdfButton: {
    backgroundColor: '#0E7490',
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
  },
  addMedButton: {
    backgroundColor: '#15803D',
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    flex: 1.5,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Card do Estoque de Medicamentos
  medCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medCardLowStock: {
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: '#FFFBFB',
  },
  medTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  medSub: {
    fontSize: 16,
    color: '#374151',
    marginTop: 4,
  },
  medEstoqueBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minHeight: 38,
    justifyContent: 'center',
  },
  medEstoqueBadgeLow: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  medEstoqueText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  medEstoqueTextLow: {
    color: '#991B1B',
  },
  lowStockBanner: {
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  lowStockText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  medMetaBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  medMetaLine: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 21,
  },
  medActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  medSecondaryBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  medSecondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  medWarnBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  medWarnBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  medDeleteButton: {
    marginLeft: 'auto',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discontinuedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#CBD5E1',
  },
  discontinuedSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
  },
  discontinuedCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  discontinuedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#374151',
  },
  discontinuedMeta: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 3,
    lineHeight: 21,
  },

  // Botão de Navegação
  backButton: {
    backgroundColor: '#4B5563',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal Geral
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 18,
    textAlign: 'center',
  },

  // Seletor de Categoria
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 12,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryTabActiveRemedio: {
    backgroundColor: '#0056B3',
  },
  categoryTabActiveAcao: {
    backgroundColor: '#15803D',
  },
  categoryTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },

  // Formulário Modal
  formScroll: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 48,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  selectItem: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  selectItemActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#15803D',
  },
  selectItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  selectItemTextActive: {
    color: '#14532D',
    fontWeight: 'bold',
  },

  // Botões do Modal
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btnCancelar: {
    flex: 1,
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  btnCancelarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  btnSalvar: {
    flex: 2,
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSalvarRemedio: {
    backgroundColor: '#0056B3',
  },
  btnSalvarAcao: {
    backgroundColor: '#15803D',
  },
  btnSalvarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newButton: {
    backgroundColor: '#0E7490',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
