import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lessons } from '../data/lessons.js'
import { VocabCard, Board, SentenceBuilder, Speaking, Quiz, AudioButton } from '../components/index.jsx'
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }
const today = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
const pad = n => String(n).padStart(2, '0')
const wordsOf = ids => lessons.filter(l => ids.includes(l.id)).flatMap(l => l.words)
const role = (p, i) => i === 1 ? 'verb' : /^(heute|jetzt)$/i.test(p) ? 'time' : /^(ich|du|er|sie|es|wir|ihr|das haus|der mann|die frau)$/i.test(p) ? 'subj' : 'obj'
const ROLE = { subj: 'Subject', verb: 'Verb', obj: 'Object', time: 'Time' }
function ColorSentence({ s }) {
  return <div className="card"><div className="row">{s.parts.map((p, i) => { const r = role(p, i); return <span key={i} className={'seg ' + r}><b>{p}</b><small>{ROLE[r]}</small></span> })}</div><p className="muted">{s.en}</p></div>
}
export function Home({ progress }) {
  const next = lessons.find(l => !progress.done.includes(l.id)) || lessons[lessons.length - 1]
  const due = wordsOf(progress.done).length
  return <div><p className="eyebrow">{greet().toUpperCase()}</p><h1>{today()}</h1>
    <section className="card desk"><p className="eyebrow">YOUR GERMAN LESSON</p><h2>Day {next.day} · {next.title}</h2>
      <p className="muted">{next.minutes} min · 5 new words · 1 grammar topic · 1 speaking exercise</p><Link className="btn" to={`/learn/${next.id}`}>Continue lesson</Link></section>
    <section className="card"><p className="eyebrow">REVISION</p>{due ? <><p>{due} vocabulary words ready to review</p><Link className="btn ghost" to="/review">Start revision</Link></> : <p>No revision is due right now. Complete a lesson and its words will appear here.</p>}</section></div>
}
export function Learn({ progress }) {
  return <div><h1>Learn</h1><p className="muted crumb">German › A0</p>
    {lessons.map(l => <Link key={l.id} to={`/learn/${l.id}`} className="card row between"><span><b>Day {l.day}</b> · {l.title}</span><span>{progress.done.includes(l.id) ? '✓' : ''}</span></Link>)}
    <p className="muted">More days are added by extending src/data/lessons.js.</p></div>
}
function NotebookPage({ L, notes, setNotes }) {
  return <div className="paper nb"><div className="nbhead"><b>GERMAN NOTEBOOK</b><span>Day {L.day} · {new Date().toLocaleDateString('en-GB')} · Page {L.day}</span><span>Topic: {L.title}</span></div>
    <textarea aria-label="My notes" rows="14" placeholder={'Rule:\n\nExamples:\n\nMy own sentence:\n\nMistake I made:'} value={notes[L.id] || ''} onChange={e => setNotes({ ...notes, [L.id]: e.target.value })} /></div>
}
const steps = ['Board', 'Words', 'Sounds', 'Grammar', 'Practice', 'Write', 'Test', 'Diary']
export function Lesson({ settings, progress, setProgress, notes, setNotes }) {
  const { id } = useParams(); const L = lessons.find(l => l.id === id)
  const [s, setS] = useState(0), [seen, setSeen] = useState([0]), [ck, setCk] = useState([]), [open, setOpen] = useState(window.innerWidth >= 900)
  if (!L) return <p>Lesson not found. <Link to="/learn">Back to lessons</Link></p>
  const go = i => { setS(i); setSeen(a => a.includes(i) ? a : [...a, i]) }
  const step = steps[s], done = progress.done.includes(L.id), nextL = lessons[lessons.indexOf(L) + 1]
  const finish = () => setProgress(p => ({ ...p, done: [...new Set([...p.done, L.id])] }))
  return <div>
    <p className="muted crumb">German › {L.level} › Day {L.day} › {step}</p><h1>{L.title}</h1>
    <div className="row"><nav className="tabs" aria-label="Lesson sections">{steps.map((n, i) => <button key={n} className={'tab' + (i === s ? ' on' : '')} onClick={() => go(i)}>{n}</button>)}</nav></div>
    <button className="btn ghost" onClick={() => go(5)}>✎ What should I write?</button>
    <div className="lesson-grid"><div key={step} className="page">
      {step === 'Board' && <Board lines={L.board} title="Today in class" />}
      {step === 'Words' && L.words.map(w => <VocabCard key={w.de} word={w} settings={settings} />)}
      {step === 'Sounds' && L.sounds.map(x => <div className="card" key={x.de}><div className="de">{x.de}</div><AudioButton text={x.de} /><p>{x.pron}</p><p className="muted">Mouth: {x.tip}</p></div>)}
      {step === 'Grammar' && <><Board title={L.grammar.title} lines={[L.grammar.why]} />
        <table className="card"><tbody>{L.grammar.table.map(([a, b]) => <tr key={a}><td className="subj">{a}</td><td className="verb">{b}</td></tr>)}</tbody></table>
        <h3>Sentence structure</h3>{L.sentences.map(x => <ColorSentence key={x.de} s={x} />)}
        <p className="tip"><b>Remember:</b> {L.grammar.tip}</p></>}
      {step === 'Practice' && <><h3>Sentence builder</h3><SentenceBuilder items={L.sentences} /><h3>Speaking</h3><Speaking target={L.sentences[0].de} /></>}
      {step === 'Write' && <><div className="card"><b>WRITE IN YOUR NOTEBOOK</b><ul className="plain">{L.write.map((x, i) => <li key={i}><label><input type="checkbox" checked={ck.includes(i)} onChange={() => setCk(ck.includes(i) ? ck.filter(z => z !== i) : [...ck, i])} /> {x}</label></li>)}</ul></div>
        <h3>Example notebook page</h3><div className="paper"><b>DAY {pad(L.day)} — {L.grammar.title}</b><br />Rule: {L.grammar.why}<br />Table: {L.grammar.table.map(r => r.join(' → ')).join(' · ')}<br />Examples: {L.sentences.map(x => x.de).join(' / ')}<br />Memory trick: {L.grammar.tip}<br />My own sentence: ________</div>
        <p className="muted">Only the small "remember" card goes into your pocket diary (see Diary).</p></>}
      {step === 'Test' && <Quiz items={L.quiz} onDone={sc => setProgress(p => ({ ...p, scores: { ...p.scores, [L.id]: sc } }))} />}
      {step === 'Diary' && <><DiaryCard L={L} /><button className="btn" onClick={finish}>Complete lesson</button>
        {done && <div className="card"><b>✓ Lesson completed</b><ul className="plain">{[['Vocabulary', 1], ['Grammar', 3], ['Speaking', 4], ['Writing', 5], ['Test', 6]].map(([n, i]) => <li key={n}>{n} {seen.includes(i) ? '✓' : '–'}</li>)}</ul><p>Next revision: tomorrow<br />Next lesson: {nextL ? `Day ${nextL.day}` : 'more days coming soon'}</p></div>}</>}
      <div className="row between"><button className="btn ghost" disabled={s === 0} onClick={() => go(s - 1)}>Back</button><button className="btn" disabled={s === steps.length - 1} onClick={() => go(s + 1)}>Next</button></div>
    </div>
    <aside><button className="btn ghost" aria-expanded={open} onClick={() => setOpen(!open)}>✎ My Notes</button>{open && <NotebookPage L={L} notes={notes} setNotes={setNotes} />}</aside></div>
  </div>
}
function DiaryCard({ L }) {
  return <div className="card paper"><b>DAY {pad(L.day)}</b><ul className="plain">{L.diary.remember.map(r => <li key={r}>{r}</li>)}</ul><p><b>Words:</b> {L.diary.words}</p><p><b>Sentence:</b> {L.diary.sentence}</p></div>
}
export function Diary() { return <div><h1>Pocket diary</h1><p className="muted">Copy only these small cards into your pocket diary.</p>{lessons.map(l => <DiaryCard key={l.id} L={l} />)}</div> }
export function Notebook({ notes }) {
  const ks = Object.keys(notes).filter(k => notes[k]?.trim())
  return <div><h1>Notebook</h1>{ks.length === 0 ? <div className="card"><p><b>Your notebook is empty.</b></p><p className="muted">Write in “✎ My Notes” during a lesson and your notes will appear here.</p></div> : ks.map(k => <div className="paper nb" key={k}><div className="nbhead"><b>{k.replace('day-', 'Day ')}</b></div><p style={{ whiteSpace: 'pre-wrap' }}>{notes[k]}</p></div>)}</div>
}
export function SpeakPage() { const all = lessons.flatMap(l => l.sentences); return <div><h1>Speaking practice</h1>{all.map(s => <Speaking key={s.de} target={s.de} />)}</div> }
export function Review({ progress }) {
  const ws = wordsOf(progress.done), [i, setI] = useState(0), [show, setShow] = useState(false)
  if (!ws.length) return <div><h1>Revision</h1><div className="card"><p><b>No revision is due right now.</b></p><p className="muted">Complete a lesson and its words will be waiting here.</p></div></div>
  const w = ws[i % ws.length], full = w.article ? `${w.article} ${w.de}` : w.de
  return <div><h1>Revision</h1><p className="muted">Word {(i % ws.length) + 1} of {ws.length}. Try to recall it before revealing.</p>
    <div className="card"><div className="de">{full}</div><AudioButton text={full} />{show ? <p>{w.en} · {w.hi}<br /><em>{w.ex}</em></p> : <div className="row"><button className="btn ghost" onClick={() => setShow(true)}>Show meaning</button></div>}
      <div className="row"><button className="btn" onClick={() => { setI(i + 1); setShow(false) }}>Next word</button></div></div></div>
}
export const More = () => <div><h1>More</h1>{[['/notebook', '✎ Notebook'], ['/diary', '📖 Pocket diary'], ['/settings', '⚙ Settings']].map(([to, l]) => <Link key={to} to={to} className="card">{l}</Link>)}</div>
export function Settings({ settings, setSettings }) {
  const set = (k, v) => setSettings({ ...settings, [k]: v })
  const sel = (k, l, o) => <label className="card row between">{l}<select value={settings[k] ?? o[0][0]} onChange={e => set(k, e.target.value)}>{o.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
  const tg = (k, l) => <label className="card row between">{l}<input type="checkbox" checked={!!settings[k]} onChange={e => set(k, e.target.checked)} /></label>
  return <div><h1>Settings</h1>
    {sel('theme', 'Theme', [['system', 'Follow system'], ['light', '☀ Light study'], ['dark', '🌙 Night study']])}
    {sel('size', 'Text size', [['1', 'A'], ['1.15', 'A+'], ['1.3', 'A++']])}
    {sel('paper', 'Notebook paper', [['lined', 'Lined'], ['plain', 'Plain'], ['grid', 'Grid']])}
    {tg('reading', 'Reading mode (wider spacing)')}{tg('en', 'English support')}{tg('hi', 'Hindi support')}{tg('focus', 'Focus mode')}{tg('calm', 'Reduce animations')}</div>
}
export const NotFound = () => <div className="card"><h1>Diese Seite wurde nicht gefunden.</h1><p>Page not found.</p><Link className="btn" to="/">Back to today’s lesson</Link></div>
