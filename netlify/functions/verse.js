/* ============================================================
   Christ Fields - "Receive a Word" serverless function
   ------------------------------------------------------------
   Takes a short note about how someone is feeling and returns a
   fitting verse + a brief encouragement, using the free NVIDIA
   stack. The KEY stays server-side (env var). The verse TEXT is
   always looked up from the canonical list below, so scripture
   can never be hallucinated - the model only chooses which one.

   Deploy notes:
   - Set NVIDIA_API_KEY in Netlify env vars (value from B:\ai-tree\.env).
   - Requires a functions-capable deploy (Git-connected or Netlify CLI;
     a plain drag-and-drop Drop deploy does not bundle functions).
   - If the key is missing or the API errors, it returns a graceful
     keyword-matched fallback so the feature never looks broken.
   ============================================================ */

const BASE = "https://integrate.api.nvidia.com/v1";
const MODEL = "meta/llama-3.3-70b-instruct";

// Canonical KJV (public domain). Model picks by number; text comes from here.
const VERSES = [
  { ref: "Philippians 4:6-7", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", keys: ["anxious", "anxiety", "worried", "worry", "stress", "overwhelm"] },
  { ref: "1 Peter 5:7", text: "Casting all your care upon him; for he careth for you.", keys: ["care", "burden", "alone"] },
  { ref: "Matthew 6:34", text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.", keys: ["future", "tomorrow", "uncertain"] },
  { ref: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", keys: ["afraid", "fear", "scared", "dismayed"] },
  { ref: "Joshua 1:9", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", keys: ["courage", "brave", "weak"] },
  { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want.", keys: ["lost", "need", "provision", "lack"] },
  { ref: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble.", keys: ["trouble", "refuge", "safe", "help"] },
  { ref: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", keys: ["trust", "confused", "direction", "path"] },
  { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", keys: ["hope", "purpose", "plan", "hopeless"] },
  { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", keys: ["why", "suffering", "hard", "pain"] },
  { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", keys: ["love", "loved", "worth", "unloved"] },
  { ref: "1 Corinthians 13:4-5", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil.", keys: ["relationship", "marriage", "patience", "kind"] },
  { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me.", keys: ["strength", "strong", "tired", "exhausted", "can't"] },
  { ref: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path.", keys: ["guidance", "word", "scripture", "dark"] },
  { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", keys: ["rest", "weary", "exhausted", "heavy"] },
  { ref: "2 Timothy 1:7", text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", keys: ["fear", "panic", "mind", "doubt"] },
  { ref: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen.", keys: ["faith", "believe", "doubt", "unseen"] },
  { ref: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", keys: ["wisdom", "decision", "choice", "unsure"] },
  { ref: "Psalm 34:18", text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", keys: ["broken", "grief", "heartbreak", "sad", "depressed", "loss"] },
  { ref: "Romans 12:2", text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.", keys: ["change", "renew", "transform", "habit"] },
];

const DEFAULT_IDX = 8; // Jeremiah 29:11
const clean = (s) => (s || "").toString().replace(/—|–/g, ", ").trim();

function fallbackVerse(input) {
  const t = (input || "").toLowerCase();
  for (const v of VERSES) {
    if (v.keys.some((k) => t.includes(k))) return v;
  }
  return VERSES[DEFAULT_IDX];
}

function payload(verse, encouragement, source) {
  return JSON.stringify({ reference: verse.ref, text: verse.text, encouragement, source });
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let input = "";
  try { input = (JSON.parse(event.body || "{}").text || "").toString().slice(0, 500); } catch (_) {}

  const key = process.env.NVIDIA_API_KEY;
  const fb = fallbackVerse(input);
  const fbEnc = "Take a quiet moment with these words. You are seen, you are held, and you are not walking this road alone.";

  if (!key) {
    return { statusCode: 200, headers, body: payload(fb, fbEnc, "fallback") };
  }

  const list = VERSES.map((v, i) => `${i + 1}. ${v.ref}: ${v.text}`).join("\n");
  const system =
    "You are a warm, pastoral companion for a faith community. Given how the person is feeling, choose the SINGLE most fitting verse from the numbered list and write 2 to 3 sentences of gentle, grounded encouragement that leans on it. Be tender, never preachy. Do not invent verses. Do not use em dashes. Respond with ONLY strict JSON: {\"n\": <verse number 1-20>, \"encouragement\": \"<your words>\"}.";
  const user = `Person's note: "${input || "I could use some encouragement today."}"\n\nVerses:\n${list}`;

  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        max_tokens: 240,
        temperature: 0.45,
      }),
    });
    if (!res.ok) throw new Error("nvidia " + res.status);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    let idx = parseInt(parsed.n, 10) - 1;
    if (!(idx >= 0 && idx < VERSES.length)) idx = VERSES.indexOf(fb);
    const enc = clean(parsed.encouragement).slice(0, 700) || fbEnc;
    return { statusCode: 200, headers, body: payload(VERSES[idx], enc, "ai") };
  } catch (e) {
    return { statusCode: 200, headers, body: payload(fb, fbEnc, "fallback") };
  }
};
