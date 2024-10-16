//@ts-nocheck

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import useAuthCheck from "@/lib/useAuth";

type User = {
  id: string;
  email: string;
};

type Builder = {
  id: string;
  name: string;
};

type UserContextType = {
  user: User | null;
  builder: Builder | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setBuilder: React.Dispatch<React.SetStateAction<Builder | null>>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [builder, setBuilder] = useState<Builder | null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthCheck();

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
        let res = await fetch('./api/builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ uid: user.id }),
        });
        if (res.ok) {
          const builderData = await res.json();
          setBuilder(builderData.user);
        } else {
          console.error('Error fetching builder data:', res);
        }
      }
    };

    if (!isLoading) {
      if (isAuthenticated) {
        checkLogin();
      } else {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setBuilder(null);
      router.push('/');
    }
  };

  return (
    <UserContext.Provider value={{ user, builder, isLoading, isAuthenticated, setUser, setBuilder, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};