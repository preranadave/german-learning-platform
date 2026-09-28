import { useEffect } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { Home, Learn, Lesson, Diary, Notebook, SpeakPage, Settings, NotFound } from './pages/pages.jsx'
const nav = [['/', 'Home'], ['/learn', 'Learn'], ['/speak', 'Speak'], ['/notebook', 'Notebook'], ['/diary', 'Diary'], ['/settings', 'Settings']]
export default function App() {
  const [settings, setSettings] = useLocalStorage('settings', { theme: 'system', size: '1', en: true, hi: true, focus: false, calm: false })
  const [progress, setProgress] = useLocalStorage('progress', { done: [], scores: {} })
  const [notes, setNotes] = useLocalStorage('notes', {})
  useEffect(() => {
    const d = document.documentElement
    d.dataset.theme = settings.theme; d.style.setProperty('--fs', settings.size); d.dataset.calm = settings.calm
  }, [settings])
  return <div className={'shell' + (settings.focus ? ' focus' : '')}>
    {!settings.focus && <nav className="nav" aria-label="Main">{nav.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav>}
    <main>
      <Routes>
        <Route path="/" element={<Home progress={progress} />} />
        <Route path="/learn" element={<Learn progress={progress} />} />
        <Route path="/learn/:id" element={<Lesson settings={settings} progress={progress} setProgress={setProgress} notes={notes} setNotes={setNotes} />} />
        <Route path="/speak" element={<SpeakPage />} />
        <Route path="/notebook" element={<Notebook notes={notes} />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </div>
}
