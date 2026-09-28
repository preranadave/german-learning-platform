import { useState, useRef } from 'react'
export function speak(text, rate = 0.9, onEnd) {
  if (!('speechSynthesis' in window)) return false
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE'; u.rate = rate
  const v = speechSynthesis.getVoices().find(v => v.lang.startsWith('de')); if (v) u.voice = v
  u.onend = u.onerror = () => onEnd && onEnd()
  speechSynthesis.speak(u); return true
}
export function AudioButton({ text }) {
  const [on, setOn] = useState(false), [pz, setPz] = useState(false), last = useRef(0.9)
  const play = r => { last.current = r; setPz(false); setOn(true); if (!speak(text, r, () => setOn(false))) setOn(false) }
  const pause = () => { if (pz) { speechSynthesis.resume(); setPz(false) } else { speechSynthesis.pause(); setPz(true) } }
  return <span className={'audio' + (on ? ' playing' : '')}>
    <button className="btn icon" aria-label={`Listen: ${text}`} onClick={() => play(0.9)}>🔊</button>
    <button className="btn icon" aria-label={`Slow: ${text}`} onClick={() => play(0.5)}>🐢</button>
    <button className="btn icon" aria-label={pz ? 'Resume' : 'Pause'} disabled={!on} onClick={pause}>{pz ? '▶' : '⏸'}</button>
    <button className="btn icon" aria-label={`Replay: ${text}`} onClick={() => play(last.current)}>🔁</button>
  </span>
}
export function VocabCard({ word, settings }) {
  const full = word.article ? `${word.article} ${word.de}` : word.de
  return <article className="card vocab">
    <div className="de">{word.article && <span className={'art art-' + word.article}>{word.article}</span>} {word.de}</div>
    <div className="pron">say: {word.pron}</div>
    <AudioButton text={full} />
    {settings.en && <div className="meaning">{word.en} <em>({word.type}{word.article ? ' · ' + { der: 'masculine', die: 'feminine', das: 'neuter' }[word.article] : ''}{word.plural ? ` · plural: ${word.plural}` : ''})</em></div>}
    {settings.hi && <div className="meaning hi">{word.hi}</div>}
    <p className="ex"><b>{word.ex}</b> <AudioButton text={word.ex} />{settings.en && <><br/><span className="muted">{word.exEn}</span></>}</p>
  </article>
}
export function Board({ lines, title }) {
  const [n, setN] = useState(1)
  return <section className="board" aria-label="Teacher board">
    {title && <h3>{title}</h3>}
    {lines.slice(0, n).map((l, i) => <p key={i}>{l}</p>)}
    {n < lines.length && <button className="btn" onClick={() => setN(n + 1)}>Next line</button>}
  </section>
}
export function SentenceBuilder({ items }) {
  const [i, setI] = useState(0), [pool, setPool] = useState(null), [chosen, setChosen] = useState([]), [res, setRes] = useState(null)
  const it = items[i]
  const p = pool || [...it.parts].map((p, k) => ({ p, k })).sort(() => Math.random() - 0.5)
  const pick = x => { setChosen([...chosen, x]); setPool(p.filter(y => y.k !== x.k)); setRes(null) }
  const reset = () => { setChosen([]); setPool(null); setRes(null) }
  const check = () => setRes(chosen.map(c => c.p).join(' ') === it.parts.join(' '))
  const next = () => { setI((i + 1) % items.length); reset() }
  return <div className="card">
    <p className="muted">Build: “{it.en}”</p>
    <div className="slot" aria-live="polite">{chosen.map(c => <span className="chip on" key={c.k}>{c.p}</span>)}</div>
    <div>{p.map(x => <button className="chip" key={x.k} onClick={() => pick(x)}>{x.p}</button>)}</div>
    <div className="row"><button className="btn" onClick={check}>Check</button><button className="btn ghost" onClick={reset}>Reset</button><button className="btn ghost" onClick={next}>Next sentence</button></div>
    {res === true && <p className="ok">✓ Correct: <b>{it.de}</b> <AudioButton text={it.de} /><br/>The verb sits in position 2.</p>}
    {res === false && <p className="bad">Not quite. Find the verb first and put it in position 2, then place the rest.</p>}
  </div>
}
const norm = s => s.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean)
export function Speaking({ target }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  const [heard, setHeard] = useState(null), [rec, setRec] = useState(false), ref = useRef()
  if (!SR) return <p className="muted">Speech recognition is not supported in this browser. Try Chrome or another supported browser. You can still listen and repeat aloud.</p>
  const go = () => {
    const r = new SR(); r.lang = 'de-DE'; r.interimResults = false; ref.current = r
    r.onresult = e => setHeard(e.results[0][0].transcript)
    r.onend = () => setRec(false); r.onerror = () => { setRec(false); setHeard('') }
    setRec(true); r.start()
  }
  const exp = norm(target), got = heard ? norm(heard) : []
  const missing = exp.filter(w => !got.includes(w))
  return <div className="card">
    <div className="de">{target}</div><AudioButton text={target} />
    <div className="row"><button className={'btn' + (rec ? ' rec' : '')} onClick={go} disabled={rec}>{rec ? '● Listening…' : '🎙 Tap to speak'}</button></div>
    {heard !== null && (heard === '' ? <p className="bad">Nothing was heard. Check your microphone permission and try again.</p> : <>
      <p>I heard: {got.map((w, i) => <span key={i} className={exp.includes(w) ? 'ok' : 'bad'}>{w} </span>)}</p>
      {missing.length === 0 ? <p className="ok">Every word matched. Try once more at normal speed.</p> : <p className="bad">Missing or unclear: <b>{missing.join(', ')}</b>. Listen with 🐢, then repeat slowly. Watch ch, w and ü sounds.</p>}</>)}
  </div>
}
export function Quiz({ items, onDone }) {
  const [ans, setAns] = useState({})
  const score = items.filter((q, i) => ans[i] === q.a).length
  return <div>
    {items.map((q, i) => <div className="card" key={i}><p><b>{q.q}</b></p>
      {q.o.map(o => <button key={o} disabled={ans[i] !== undefined} className={'chip' + (ans[i] !== undefined && o === q.a ? ' right' : ans[i] === o ? ' wrong' : '')} onClick={() => setAns({ ...ans, [i]: o })}>{o}</button>)}
      {ans[i] !== undefined && <p className={ans[i] === q.a ? 'ok' : 'bad'}>{ans[i] === q.a ? '✓ Correct' : `✗ Answer: ${q.a}`}</p>}</div>)}
    {Object.keys(ans).length === items.length && <p className="card">Score: {score}/{items.length}. {score < items.length ? 'Revisit the items marked ✗ before moving on.' : 'Solid. Ready for the next day.'} <button className="btn" onClick={() => onDone?.(score)}>Save result</button></p>}
  </div>
}
