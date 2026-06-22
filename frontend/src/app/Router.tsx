import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { MainPage } from '@/pages/MainPage'

export function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </Layout>
  )
}
