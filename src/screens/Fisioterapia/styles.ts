import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { padding: 24, flexGrow: 1 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#B45309', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#4B5563', marginBottom: 20, lineHeight: 22 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  infoText: { fontSize: 16, color: '#4B5563', marginBottom: 16, lineHeight: 22 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, fontSize: 18, color: '#1F2937', marginBottom: 12 },
  actionButton: { backgroundColor: '#F59E0B', padding: 16, minHeight: 48, justifyContent: 'center', borderRadius: 12, alignItems: 'center' },
  actionButtonText: { color: '#1F2937', fontSize: 16, fontWeight: '800' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D97706', padding: 16, minHeight: 48, justifyContent: 'center', borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  secondaryButtonText: { color: '#92400E', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#dc3545', padding: 16, minHeight: 48, justifyContent: 'center', borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  historyContainer: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  historyItemText: { fontSize: 16, color: '#1F2937', marginBottom: 6, lineHeight: 22 },
  emptyHistory: { fontSize: 16, color: '#4B5563', fontStyle: 'italic' },
});

