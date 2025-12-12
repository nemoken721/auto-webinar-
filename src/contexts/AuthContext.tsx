'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getTenant, createTenant } from '@/lib/firebase/firestore';
import type { Tenant } from '@/types';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, companyName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch tenant data
        const tenantData = await getTenant(firebaseUser.uid);
        setTenant(tenantData);
      } else {
        setTenant(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const tenantData = await getTenant(result.user.uid);

    if (tenantData?.status === 'suspended') {
      await firebaseSignOut(auth);
      throw new Error('アカウントが停止されています。');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setTenant(null);
  };

  const signUp = async (email: string, password: string, companyName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createTenant(result.user.uid, { email, companyName });
    const tenantData = await getTenant(result.user.uid);
    setTenant(tenantData);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
