import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { setCloudUser } from "@/lib/resume/storage";

interface AuthState {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let lastId: string | null = null;
    const apply = (u: User | null) => {
      setUser(u);
      setLoading(false);
      const id = u?.id ?? null;
      if (id !== lastId) {
        lastId = id;
        void setCloudUser(id);
      }
    };
    const { data } = supabase.auth.onAuthStateChange((_e, session) => apply(session?.user ?? null));
    supabase.auth.getSession().then(({ data: d }) => apply(d.session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: async () => void (await supabase.auth.signOut()) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
