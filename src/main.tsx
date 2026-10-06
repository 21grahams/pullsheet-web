import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-serif-display/400.css';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { App } from './App';
import { NotifyProvider } from './components/NotifyProvider';
import { AuthProvider } from './features/auth/AuthProvider';
import { theme } from './theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    // Saves run immediately and fail fast when offline, instead of TanStack's
    // default of pausing and replaying later. Never silently queue a write.
    mutations: { networkMode: 'always', retry: false },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {/* HashRouter (#/singles) so GitHub Pages needs no server rewrites. */}
        <HashRouter>
          <AuthProvider>
            <NotifyProvider>
              <App />
            </NotifyProvider>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
