'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useGetMeQuery } from '@/services';
import { User } from '@/services/types/api.types';

const AuthContext = createContext<{ user: User | null; isLoading: boolean }>({
  user: null,
  isLoading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [skip, setSkip] = useState(true);
  
  useEffect(() => {
    // Проверяем токен только один раз
    const token = localStorage.getItem('token');
    console.log('toke', token)
    setSkip(!token);
  }, []);
  
  const { data: user, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  
  return (
    <AuthContext.Provider value={{ user: user || null, isLoading: isLoading && !skip }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider
export const useAuth = () => useContext(AuthContext);