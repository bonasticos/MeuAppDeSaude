import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { padding: 24, flexGrow: 1 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#17a2b8', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  sosButton: { backgroundColor: '#dc3545', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 4 },
  sosButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  infoText: { fontSize: 16, color: '#666', marginBottom: 16 },
  actionButton: { backgroundColor: '#17a2b8', padding: 16, borderRadius: 12, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#17a2b8', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  secondaryButtonText: { color: '#17a2b8', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#6c757d', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  modalHeader: {flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#17a2b8', alignItems: 'center'},
  modalTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  closeText: {color: '#fff', fontSize: 16},
  questionCard: {backgroundColor: '#f1f3f5', padding: 16, borderRadius: 12, marginBottom: 16},
  questionText: {fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12},
  optionsRow: {flexDirection: 'column', gap: 8},
  optionBtn: {backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6', padding: 12, borderRadius: 8, alignItems: 'center'},
  optionBtnSelected: {backgroundColor: '#17a2b8', borderColor: '#17a2b8'},
  optionText: {color: '#495057', fontSize: 14},
  optionTextSelected: {color: '#fff', fontWeight: 'bold'},
  submitQuizBtn: {backgroundColor: '#28a745', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 40},
  submitQuizText: {color: '#fff', fontSize: 18, fontWeight: 'bold'}
});

