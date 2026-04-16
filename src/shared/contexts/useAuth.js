import { useContext } from 'react';
import { AuthContext } from './AuthContextObject';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }

  return context;
}
