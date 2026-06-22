import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { padding: 24, flexGrow: 1 },
  listContainer: { padding: 24, flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0056b3' },
  addButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8 },
  pdfButton: { backgroundColor: '#17a2b8', padding: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 16, fontSize: 18 },
  saveButton: { backgroundColor: '#0056b3', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#6c757d', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 16, color: '#666' },
  estoqueBadge: { backgroundColor: '#e0f7fa', padding: 8, borderRadius: 8 },
  estoqueText: { color: '#17a2b8', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#666', fontSize: 16, marginTop: 40 },
  backButton: { backgroundColor: '#dc3545', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

