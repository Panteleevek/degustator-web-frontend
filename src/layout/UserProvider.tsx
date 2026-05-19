// src/components/UserProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useGetMeQuery } from '@/services';
import { useDispatch } from '@/store/hooks';
import { setCurrentUser } from '@/store/slices/authSlice';
import { useAuth } from './AuthProvider';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const auth = useAuth();
    console.log('auth', auth)
  const { data: user, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  
  useEffect(() => {
    // ✅ Только один раз диспатчим
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user, dispatch]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }
  
  return <>{children}</>;
}

export default UserProvider