import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'

const SearchPage = lazy(() =>
  import('../../pages/search/SearchPage').then((module) => ({
    default: module.SearchPage,
  })),
)
const SettingsPage = lazy(() =>
  import('../../pages/settings/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
)

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={null}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
