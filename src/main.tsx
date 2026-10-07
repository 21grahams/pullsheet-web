import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-serif-display/400.css';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';

import { App } from './App';
import { NotifyProvider } from './components/NotifyProvider';
import { AuthProvider } from './features/auth/AuthProvider';
import { persistOptions, queryClient } from './lib/queryClient';
import { theme } from './theme/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        {/* HashRouter (#/singles) so GitHub Pages needs no server rewrites. */}
        <HashRouter>
          <AuthProvider>
            <NotifyProvider>
              <App />
            </NotifyProvider>
          </AuthProvider>
        </HashRouter>
      </PersistQueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
