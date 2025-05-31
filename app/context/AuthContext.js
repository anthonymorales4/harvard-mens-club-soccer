"use client";

import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (mounted) {
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile: ", profileError);
            }

            setUser({
              ...session.user,
              profile: profileData,
            });
          } else {
            setUser(null);
          }
          setError(null);
        }
      } catch (error) {
        console.error("Error getting initial session: ", error);
        if (mounted) {
          setError(error.message);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (!mounted) return;

      try {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile", profileError);
            }

            setUser({
              ...session.user,
              profile: profileData,
            });
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
        setError(null);
      } catch (error) {
        console.error("Error in auth state change: ", error);
        setError(error.message);
      } finally {
        if (!initialized) {
          setLoading(false);
          setInitialized(true);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
      setError(error.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signOut, initialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
