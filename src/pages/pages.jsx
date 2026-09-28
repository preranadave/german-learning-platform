import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lessons } from '../data/lessons.js'
import { VocabCard, Board, SentenceBuilder, Speaking, Quiz, AudioButton } from '../components/index.jsx'
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }
export function Home({ progress }) {
  const next = lessons.find(l => !progress.done.includes(l.id)) || lessons[lessons.length - 1]
  return <div><h1>{greet()}.</h1><p className="muted">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    <section className="card desk"><h2>Day {next.day}: {next.title}</h2><p>{next.minutes} min · 5 new words · 1 grammar topic · speaking · writing · mini test</p>
      <Link className="btn" to={`/learn/${next.id}`}>Continue lesson</Link></section>
    <p className="muted">Completed: {progress.done.length} of {lessons.length} available lessons.</p></div>
}
export function Learn({ progress }) {
  return <div><h1>Learn</h1><p className="muted">German › A0</p>
    {lessons.map(l => <Link key={l.id} to={`/learn/${l.id}`} className="card row between"><span><b>Day {l.day}</b> · {l.title}</span><span>{progress.done.includes(l.id) ? '✓' : ''}</span></Link>)}
    <p className="muted">More days are added by extending src/data/lessons.js.</p></div>
}
const steps = ['Board', 'Words', 'Sounds', 'Grammar', 'Practice', 'Notes', 'Test', 'Diary']
export function Lesson({ settings, progress, setProgress, notes, setNotes }) {
  const { id } = useParams(); const L = lessons.find(l => l.id === id); const [s, setS] = useState(0); const [ck, setCk] = useState([])
  if (!L) return <p>Lesson not found. <Link to="/learn">Back to lessons</Link></p>
  const step = steps[s]
  const finish = () => setProgress(p => ({ ...p, done: [...new Set([...p.done, L.id])] }))
  return <div>
    <p className="muted">German › {L.level} › Day {L.day} › {step}</p><h1>{L.title}</h1>
    <nav className="tabs" aria-label="Lesson sections">{steps.map((n, i) => <button key={n} className={'tab' + (i === s ? ' on' : '')} onClick={() => setS(i)}>{n}</button>)}</nav>
    {step === 'Board' && <Board lines={L.board} title="Today in class" />}
    {step === 'Words' && L.words.map(w => <VocabCard key={w.de} word={w} settings={settings} />)}
    {step === 'Sounds' && L.sounds.map(x => <div className="card" key={x.de}><div className="de">{x.de}</div><AudioButton text={x.de} /><p>{x.pron}</p><p className="muted">Mouth: {x.tip}</p></div>)}
    {step === 'Grammar' && <><Board title={L.grammar.title} lines={[L.grammar.why]} />
      <table className="card"><tbody>{L.grammar.table.map(([a, b]) => <tr key={a}><td className="subj">{a}</td><td className="verb">{b}</td></tr>)}</tbody></table>
      <p className="tip"><b>Remember:</b> {L.grammar.tip}</p></>}
    {step === 'Practice' && <><h3>Sentence builder</h3><SentenceBuilder items={L.sentences} /><h3>Speaking</h3><Speaking target={L.sentences[0].de} /></>}
    {step === 'Notes' && <><div className="card"><b>✎ What should I write?</b><ul>{L.write.map((x, i) => <li key={i}><label><input type="checkbox" checked={ck.includes(i)} onChange={() => setCk(ck.includes(i) ? ck.filter(z => z !== i) : [...ck, i])} /> {x}</label></li>)}</ul></div>
      <textarea className="paper" rows="10" placeholder="My notes: my own sentence, my mistakes, memory tricks…" value={notes[L.id] || ''} onChange={e => setNotes({ ...notes, [L.id]: e.target.value })} /></>}
    {step === 'Test' && <Quiz items={L.quiz} onDone={sc => setProgress(p => ({ ...p, scores: { ...p.scores, [L.id]: sc } }))} />}
    {step === 'Diary' && <><DiaryCard L={L} /><button className="btn" onClick={finish}>Complete lesson</button>{progress.done.includes(L.id) && <p className="ok">✓ Lesson completed. Next revision: tomorrow.</p>}</>}
    <div className="row between"><button className="btn ghost" disabled={s === 0} onClick={() => setS(s - 1)}>Back</button><button className="btn" disabled={s === steps.length - 1} onClick={() => setS(s + 1)}>Next</button></div>
  </div>
}
function DiaryCard({ L }) {
  return <div className="card paper"><b>DAY {String(L.day).padStart(2, '0')}</b><ul>{L.diary.remember.map(r => <li key={r}>{r}</li>)}</ul><p><b>Words:</b> {L.diary.words}</p><p><b>Sentence:</b> {L.diary.sentence}</p></div>
}
export function Diary() { return <div><h1>Pocket diary</h1><p className="muted">Copy only these small cards into your pocket diary.</p>{lessons.map(l => <DiaryCard key={l.id} L={l} />)}</div> }
export function Notebook({ notes }) {
  const ks = Object.keys(notes).filter(k => notes[k]?.trim())
  return <div><h1>Notebook</h1>{ks.length === 0 ? <p className="card">Your notebook is empty. Open a lesson and use the Notes section; your notes appear here.</p> : ks.map(k => <div className="card paper" key={k}><b>{k.replace('day-', 'Day ')}</b><p style={{ whiteSpace: 'pre-wrap' }}>{notes[k]}</p></div>)}</div>
}
export function SpeakPage() { const all = lessons.flatMap(l => l.sentences); return <div><h1>Speaking practice</h1>{all.map(s => <Speaking key={s.de} target={s.de} />)}</div> }
export function Settings({ settings, setSettings }) {
  const t = (k, l) => <label className="card row between">{l}<input type="checkbox" checked={settings[k]} onChange={e => setSettings({ ...settings, [k]: e.target.checked })} /></label>
  return <div><h1>Settings</h1>
    <label className="card row between">Theme<select value={settings.theme} onChange={e => setSettings({ ...settings, theme: e.target.value })}><option value="system">Follow system</option><option value="light">Light study</option><option value="dark">Night study</option></select></label>
    <label className="card row between">Text size<select value={settings.size} onChange={e => setSettings({ ...settings, size: e.target.value })}><option value="1">A</option><option value="1.15">A+</option><option value="1.3">A++</option></select></label>
    {t('en', 'English support')}{t('hi', 'Hindi support')}{t('focus', 'Focus mode (hide navigation)')}{t('calm', 'Reduce animations')}</div>
}
export const NotFound = () => <div className="card"><h1>Diese Seite wurde nicht gefunden.</h1><p>Page not found.</p><Link className="btn" to="/">Back to today’s lesson</Link></div>
