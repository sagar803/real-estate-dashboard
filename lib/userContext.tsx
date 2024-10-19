//@ts-nocheck

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import useAuthCheck from "@/lib/useAuth";

type User = {
  id: string;
  email: string;
  full_name: string;
  id: string;
  picture: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthCheck();
  console.log(user)

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/');
      else setUser({id: user.id, ...user.user_metadata});
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
      router.push('/');
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, isAuthenticated, setUser, signOut }}>
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