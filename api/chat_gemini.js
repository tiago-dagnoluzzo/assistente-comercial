// api/chat_gemini.js
// Proxy Gemini (Google AI Studio) — usar no Vercel
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    let body = req.body; if (typeof body === "string") body = JSON.parse(body||"{}");
    const { system, messages, model } = body || {};
    const convo = (messages || []).map(m => `${m.who}: ${m.text}`).join("\n");
    const prompt = `${system||"Você é um consultor de automóveis."}\n\nHistórico (mais recente último):\n${convo}\n\nResponda apenas como consultor.`;

    const mdl = model || "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const r = await fetch(url, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ contents:[{ role:"user", parts:[{ text:prompt }] }] })
    });
    const raw = await r.text();
    let data; try{ data = JSON.parse(raw) }catch{}
    if (!r.ok) return res.status(r.status||502).json({ error:"Gemini error", raw });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.status(200).json({ text, provider:"gemini", status:r.status });
  } catch(e){ res.status(500).json({ error:e.message }); }
}
