import { Navigate, Route, Routes } from 'react-router-dom'
import { SearchPage } from '../../pages/search/SearchPage'
import { SettingsPage } from '../../pages/settings/SettingsPage'
import { AppShell } from '../../shared/components/layout/AppShell'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
