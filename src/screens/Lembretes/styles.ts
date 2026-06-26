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
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Abas Principais (Alarmes vs Estoque Médico)
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
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
    color: '#6C757D',
  },
  tabTextActive: {
    color: '#0056B3',
  },

  // Filtros de Lembretes (Sub-filtros: Todos, Remédios, Ações)
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E2E6EA',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6C757D',
  },
  filterTabTextActive: {
    color: '#17A2B8',
  },

  // Layout Geral da Lista
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espaço para botão flutuante e de voltar
  },

  // Estilos de Lembretes
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.6,
  },
  remedioCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#007BFF', // Azul para remédios
  },
  acaoCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#28A745', // Verde para ações
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 4,
  },
  remedioBadge: {
    backgroundColor: '#E8F0FE',
  },
  acaoBadge: {
    backgroundColor: '#E6F4EA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  remedioBadgeText: {
    color: '#1A73E8',
  },
  acaoBadgeText: {
    color: '#137333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  cardNotes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 6,
    backgroundColor: '#F8F9FA',
    padding: 6,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
  },
  checkButtonActive: {
    backgroundColor: '#E6F4EA',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },

  // Botões de Estoque Médico (Farmácia)
  rowButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  pdfButton: {
    backgroundColor: '#17A2B8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
  },
  addMedButton: {
    backgroundColor: '#28A745',
    padding: 16,
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
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  medSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medEstoqueBadge: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  medEstoqueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  medDeleteButton: {
    marginLeft: 10,
    padding: 5,
  },

  // Botão Flutuante (Novo Lembrete)
  addButton: {
    position: 'absolute',
    bottom: 90, // Subido para dar espaço para o botão "Voltar ao Painel"
    right: 24,
    backgroundColor: '#17A2B8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },

  // Botão de Navegação
  backButton: {
    backgroundColor: '#6C757D',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 15,
    borderRadius: 10,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Seletor de Categoria
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    padding: 4,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryTabActiveRemedio: {
    backgroundColor: '#007BFF',
  },
  categoryTabActiveAcao: {
    backgroundColor: '#28A745',
  },
  categoryTabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5F6368',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },

  // Formulário Modal
  formScroll: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectItem: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectItemActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#28A745',
  },
  selectItemText: {
    fontSize: 13,
    color: '#5F6368',
  },
  selectItemTextActive: {
    color: '#137333',
    fontWeight: 'bold',
  },

  // Botões do Modal
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btnCancelar: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
  },
  btnCancelarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F6368',
  },
  btnSalvar: {
    flex: 2,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSalvarRemedio: {
    backgroundColor: '#007BFF',
  },
  btnSalvarAcao: {
    backgroundColor: '#28A745',
  },
  btnSalvarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newButton: {
    backgroundColor: '#17A2B8',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
