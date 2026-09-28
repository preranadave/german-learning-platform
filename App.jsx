import { Component, useEffect } from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { Home, Learn, Lesson, Diary, Notebook, SpeakPage, Review, More, Settings, NotFound } from './pages/pages.jsx'
const side = [['/', 'Home'], ['/learn', 'Learn'], ['/speak', 'Speak'], ['/review', 'Revision'], ['/notebook', 'Notebook'], ['/diary', 'Pocket diary'], ['/settings', 'Settings']]
const bottom = [['/', 'Home'], ['/learn', 'Learn'], ['/speak', 'Speak'], ['/review', 'Review'], ['/more', 'More']]
class Boundary extends Component {
  state = { e: false }
  static getDerivedStateFromError() { return { e: true } }
  render() { return this.state.e ? <div className="card"><p>Something went wrong while loading this lesson.</p><button className="btn" onClick={() => this.setState({ e: false })}>Try again</button></div> : this.props.children }
}
export default function App() {
  const [settings, setSettings] = useLocalStorage('settings', { theme: 'system', size: '1', paper: 'lined', reading: false, en: true, hi: true, focus: false, calm: false })
  const [progress, setProgress] = useLocalStorage('progress', { done: [], scores: {} })
  const [notes, setNotes] = useLocalStorage('notes', {})
  const { pathname } = useLocation()
  useEffect(() => {
    const d = document.documentElement, mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { d.dataset.theme = settings.theme === 'system' ? (mq.matches ? 'dark' : 'light') : settings.theme }
    apply(); mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply)
  }, [settings.theme])
  useEffect(() => {
    const d = document.documentElement
    d.style.setProperty('--fs', settings.size); d.dataset.calm = !!settings.calm; d.dataset.paper = settings.paper || 'lined'; d.dataset.reading = !!settings.reading
  }, [settings])
  const set = (k, v) => setSettings({ ...settings, [k]: v })
  const tools = <>
    <button className="btn icon" aria-label="Change theme (light, night, system)" onClick={() => set('theme', { system: 'light', light: 'dark', dark: 'system' }[settings.theme])}>{{ system: '⚙', light: '☀', dark: '🌙' }[settings.theme]}</button>
    <button className="btn icon" aria-label="Focus mode" onClick={() => set('focus', true)}>🎯</button></>
  const f = settings.focus
  return <div className={'shell' + (f ? ' focus' : '')}>
    {!f && <aside className="side"><b className="brand">Deutsch</b>{side.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}<div className="tools">{tools}</div></aside>}
    {!f && <header className="top"><b className="brand">Deutsch</b><div>{tools}</div></header>}
    {f && <button className="btn ghost exit" onClick={() => set('focus', false)}>Exit focus mode</button>}
    <main><Boundary key={pathname}><div className="page" key={pathname}>
      <Routes>
        <Route path="/" element={<Home progress={progress} />} />
        <Route path="/learn" element={<Learn progress={progress} />} />
        <Route path="/learn/:id" element={<Lesson settings={settings} progress={progress} setProgress={setProgress} notes={notes} setNotes={setNotes} />} />
        <Route path="/speak" element={<SpeakPage />} />
        <Route path="/review" element={<Review progress={progress} />} />
        <Route path="/notebook" element={<Notebook notes={notes} />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/more" element={<More />} />
        <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
        <Route path="*" element={<NotFound />} />
      </Routes></div></Boundary></main>
    {!f && <nav className="bottom" aria-label="Main">{bottom.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav>}
  </div>
}
