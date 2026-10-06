import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { cachePersister } from '../../lib/queryClient';
import { supabase } from '../../lib/supabase';
import { AuthContext, friendlyAuthError, type AuthContextValue } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // Fires on login, logout, token refresh, and when a session expires or
    // is revoked (which sends the app back to the login screen).
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    session,
    loading,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return error ? friendlyAuthError(error.message) : null;
    },
    async signOut() {
      // 'local' = log out this device only. Supabase's default ('global')
      // would also end the session on every other device you're logged into.
      await supabase.auth.signOut({ scope: 'local' });
      // Drop every piece of loaded data so nothing lingers on the device.
      queryClient.clear();
      await cachePersister.removeClient();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
