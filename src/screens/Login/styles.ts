import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#0056b3',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 16,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0056b3',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  guestButton: {
    marginTop: 12,
    backgroundColor: '#E9F2FF',
    borderWidth: 1,
    borderColor: '#0056b3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    color: '#0056b3',
    fontSize: 17,
    fontWeight: 'bold',
  },
  uncFooter: {
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#EAF2FA',
    alignItems: 'center',
  },
  uncFooterText: {
    fontSize: 13,
    color: '#103457',
    fontWeight: '600',
    textAlign: 'center',
  },
  uncFooterLink: {
    fontSize: 13,
    color: '#0056b3',
    fontWeight: '800',
    marginTop: 2,
  },
});

