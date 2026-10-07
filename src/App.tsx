import { Navigate, Route, Routes } from 'react-router';

import { AppShell } from './components/AppShell';
import { SettingsPage } from './features/accounts/SettingsPage';
import { LoginPage } from './features/auth/LoginPage';
import { RequireAuth } from './features/auth/RequireAuth';
import { SealedPage } from './features/sealed/SealedPage';
import { SinglesPage } from './features/singles/SinglesPage';
import { SummaryPage } from './features/summary/SummaryPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/singles" replace />} />
        <Route path="/singles" element={<SinglesPage />} />
        <Route path="/sealed" element={<SealedPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
