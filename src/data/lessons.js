// Add new days by appending objects of this shape.
const w = (de, article, plural, pron, en, hi, type, ex, exEn) => ({ de, article, plural, pron, en, hi, type, ex, exEn })
export const lessons = [
{ id: 'day-01', level: 'A0', day: 1, title: 'German foundations: sounds & first words', minutes: 40,
  board: [
    'German is written almost exactly as it is pronounced. Learn the sounds once and you can read any word.',
    'Vowels: a e i o u, plus umlauts ä ö ü. Ä sounds like "e" in "bed"; Ö like "e" in "her" with rounded lips; Ü is "ee" with rounded lips.',
    'ß = "ss". CH after a, o, u is a throaty "kh" (Buch); after e, i it is a soft hiss (ich).',
    'ei = "eye" (nein). ie = "ee" (Liebe). The letters say what they sound like.',
    'ALL nouns are written with a Capital letter: das Haus, der Mann.'],
  sounds: [
    { de: 'ich', pron: 'ikh (soft, like a whispered "h" in "huge")', tip: 'Tongue flat, near the roof of the mouth; push air gently.' },
    { de: 'Buch', pron: 'bookh (throaty kh, like clearing your throat softly)', tip: 'Back of the tongue rises toward the throat.' },
    { de: 'schön', pron: 'shurn (round your lips for ö)', tip: 'Say "ay", then round your lips without moving your tongue.' },
    { de: 'Straße', pron: 'SHTRAH-suh', tip: 'ß = ss. "st" at the start of a word sounds "sht".' }],
  words: [
    w('ich', null, null, 'ikh', 'I', 'मैं', 'pronoun', 'Ich bin hier.', 'I am here.'),
    w('du', null, null, 'doo', 'you (informal, one person)', 'तुम', 'pronoun', 'Du bist nett.', 'You are nice.'),
    w('Haus', 'das', 'die Häuser', 'howss', 'house', 'घर', 'noun', 'Das Haus ist groß.', 'The house is big.'),
    w('gut', null, null, 'goot', 'good', 'अच्छा', 'adjective', 'Das ist gut.', 'That is good.'),
    w('sein', null, null, 'zine', 'to be', 'होना', 'verb', 'Ich bin müde.', 'I am tired.')],
  grammar: { title: 'sein = to be', why: 'German verbs change their ending depending on WHO does the action. "sein" is irregular, so learn it as a block.',
    table: [['ich','bin'],['du','bist'],['er/sie/es','ist'],['wir','sind'],['ihr','seid'],['sie/Sie','sind']],
    tip: 'In a normal statement the conjugated verb is in position 2: Ich | bin | müde.' },
  sentences: [
    { de: 'Ich bin müde.', en: 'I am tired.', parts: ['Ich','bin','müde'] },
    { de: 'Du bist nett.', en: 'You are nice.', parts: ['Du','bist','nett'] },
    { de: 'Das Haus ist gut.', en: 'The house is good.', parts: ['Das Haus','ist','gut'] }],
  quiz: [
    { q: 'Which article goes with Haus?', a: 'das', o: ['der','die','das'] },
    { q: 'ich ___ müde.', a: 'bin', o: ['bist','bin','ist'] },
    { q: 'du ___ nett.', a: 'bist', o: ['bist','bin','sind'] },
    { q: 'Meaning of "gut"?', a: 'good', o: ['house','good','you'] },
    { q: 'ß sounds like…', a: 'ss', o: ['b','ss','sh'] }],
  write: ['Title: DAY 01 — Sounds & sein','Section Aussprache: ei, ie, ä, ö, ü, ß with one example each','Section Wörter: das Haus – die Häuser, gut, ich, du, sein','Section Grammatik: sein table (all 6 forms)','Section Sätze: 3 sentences + 1 of your own'],
  diary: { remember: ['ich BIN · du BIST · er IST · wir SIND', 'Verb = position 2', 'Nouns start with a Capital'], words: 'das Haus, gut, ich, du, sein', sentence: 'Ich bin zu Hause.' } },
{ id: 'day-02', level: 'A0', day: 2, title: 'Pronouns and simple sentences', minutes: 40,
  board: ['Personal pronouns: ich, du, er, sie, es, wir, ihr, sie, Sie.','"sie" = she OR they; "Sie" (capital) = formal you. Use Sie with professors, officials, strangers; du with friends.','Sentence pattern: Subject + Verb + rest. Ich lerne Deutsch.'],
  sounds: [{ de: 'wir', pron: 'veer (German W = English V)', tip: 'Top teeth on lower lip.' }, { de: 'Sie', pron: 'zee (German S before a vowel = Z)', tip: 'Voiced buzzing sound.' }],
  words: [
    w('Mann','der','die Männer','mahn','man','आदमी','noun','Der Mann ist nett.','The man is nice.'),
    w('Frau','die','die Frauen','frow','woman / Mrs.','महिला','noun','Die Frau lernt Deutsch.','The woman learns German.'),
    w('lernen',null,null,'LER-nen','to learn','सीखना','verb','Ich lerne Deutsch.','I learn German.'),
    w('Deutsch','das',null,'doytsh','German (language)','जर्मन','noun','Ich lerne Deutsch.','I am learning German.'),
    w('heute',null,null,'HOY-tuh','today','आज','adverb','Heute lerne ich.','Today I learn.')],
  grammar: { title: 'Regular verbs: lernen', why: 'Remove -en to get the stem (lern-), then add the ending for the person.',
    table: [['ich','lerne'],['du','lernst'],['er/sie/es','lernt'],['wir','lernen'],['ihr','lernt'],['sie/Sie','lernen']],
    tip: 'Time first? The verb still stays in position 2: Heute | lerne | ich Deutsch.' },
  sentences: [{ de: 'Ich lerne heute Deutsch.', en: 'I learn German today.', parts: ['Ich','lerne','heute','Deutsch'] }, { de: 'Heute lerne ich Deutsch.', en: 'Today I learn German.', parts: ['Heute','lerne','ich','Deutsch'] }],
  quiz: [{ q: 'wir ___ Deutsch.', a: 'lernen', o: ['lernt','lernen','lerne'] }, { q: 'Article of Mann?', a: 'der', o: ['der','die','das'] }, { q: 'Formal "you"?', a: 'Sie', o: ['sie','du','Sie'] }, { q: 'er ___ Deutsch.', a: 'lernt', o: ['lernt','lernst','lerne'] }],
  write: ['Title: DAY 02 — Pronouns','All 9 pronouns with meanings','lernen table','Two sentences with "heute"'],
  diary: { remember: ['Stem + ending: lern-e, lern-st, lern-t', 'Sie = formal'], words: 'der Mann, die Frau, lernen, Deutsch, heute', sentence: 'Heute lerne ich Deutsch.' } }
]
