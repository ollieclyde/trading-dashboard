import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { RunExplorerPage } from './pages/RunExplorerPage'
import { DebateBrowserPage } from './pages/DebateBrowserPage'
import { ThemeTimelinePage } from './pages/ThemeTimelinePage'
import { PositionsPage } from './pages/PositionsPage'
import { ReflectionsPage } from './pages/ReflectionsPage'
import { PipelineFunnelPage } from './pages/PipelineFunnelPage'
import { SystemPage } from './pages/SystemPage'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<RunExplorerPage />} />
          <Route path="/runs/:date" element={<RunExplorerPage />} />
          <Route path="/debates" element={<DebateBrowserPage />} />
          <Route path="/debates/:id" element={<DebateBrowserPage />} />
          <Route path="/themes" element={<ThemeTimelinePage />} />
          <Route path="/themes/:themeKey" element={<ThemeTimelinePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/reflections" element={<ReflectionsPage />} />
          <Route path="/pipeline" element={<PipelineFunnelPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Routes>
      </main>
    </div>
  )
}
