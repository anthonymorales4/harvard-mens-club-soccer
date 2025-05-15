"use client";

import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Provider component that wraps your app and make auth object available to any child component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs once when the component mounts
  // Check for user session when component mounts
  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);

          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            setUser((currentUser) => ({
              ...currentUser,
              profile: profileData,
            }));
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Updates the user state when auth changes (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the listener on onmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    // Pass values that will be given to the context
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
