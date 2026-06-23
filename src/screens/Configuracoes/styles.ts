import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { padding: 24, flexGrow: 1, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 24, alignSelf: 'flex-start' },
  
  photoContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#0056b3',
    fontWeight: 'bold',
  },

  formGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },

  saveButton: { backgroundColor: '#28a745', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  recoverButton: { backgroundColor: '#ffc107', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 16 },
  recoverButtonText: { color: '#333', fontSize: 18, fontWeight: 'bold' },

  backButton: { padding: 16, marginTop: 16, alignItems: 'center' },
  backButtonText: { color: '#666', fontSize: 16, fontWeight: 'bold' },

  logoutButton: { backgroundColor: '#dc3545', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 16 },
  logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

