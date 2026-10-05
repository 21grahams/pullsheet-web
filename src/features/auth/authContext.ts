import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export interface AuthContextValue {
  session: Session | null;
  /** True until the saved session (if any) has been read on startup. */
  loading: boolean;
  /** Resolves to an error message to show, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function friendlyAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Wrong email or password.';
  if (/fetch|network/i.test(message)) return "Can't reach PullSheet. Check your connection and try again.";
  return message;
}
