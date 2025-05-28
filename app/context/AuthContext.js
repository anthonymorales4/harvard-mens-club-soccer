"use client";

import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          if (data) {
            setUser((currentUser) => ({
              ...currentUser,
              profile: data,
            }));
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting initial session: ", error);
        setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
