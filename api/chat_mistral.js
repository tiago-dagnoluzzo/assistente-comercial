// api/chat_mistral.js
// Proxy Mistral — usar no Vercel
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    if (!process.env.MISTRAL_API_KEY) return res.status(500).json({ error: "Missing MISTRAL_API_KEY" });
    let body = req.body; if (typeof body === "string") body = JSON.parse(body||"{}");
    const { system, messages, model } = body || {};
    const convo = (messages || []).map(m => `${m.who}: ${m.text}`).join("\n");
    const prompt = `${system||"Você é um consultor de automóveis."}\n\nHistórico (mais recente último):\n${convo}\n\nResponda apenas como consultor.`;

    const mdl = model || "mistral-small-latest";
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+process.env.MISTRAL_API_KEY },
      body: JSON.stringify({ model: mdl, messages:[{ role:"user", content: prompt }] })
    });
    const raw = await r.text();
    let data; try{ data = JSON.parse(raw) }catch{}
    if (!r.ok) return res.status(r.status||502).json({ error:"Mistral error", raw });
    const text = data?.choices?.[0]?.message?.content || "";
    res.status(200).json({ text, provider:"mistral", status:r.status });
  } catch(e){ res.status(500).json({ error:e.message }); }
}
