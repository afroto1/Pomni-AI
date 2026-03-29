import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  if (!text) return m.reply(`
╮───────────────────────╭ـ
مرحبا بك فى بوت بلاك 🤖

مثال:
│❏ بوت من نيكولا تسلا
│❏ بوت افضل انمى
│❏ بوت هات فزورة أو لغز
╰───────────────────────╯
`)

  await m.reply(wait)

  try {
    let result = await askAI(text)

    await m.reply(`
╮───────────────────────╭ـ
${result}
╰───────────────────────╯
`)
  } catch (e) {
    console.log(e)
    await m.reply('وقعت مشكلة مع الذكاء الاصطناعي 😢')
  }
}

handler.help = ["بوت"]
handler.tags = ["ai"]
handler.command = /^(بوت)$/i

export default handler

/* ================== AI FUNCTION ================== */

async function askAI(text) {

  const API_KEY = "ضع_مفتاحك_هنا" // 👈 ضع مفتاحك هنا

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أنت بوت عربي ذكي اسمه بوت بلاك، ترد بشكل احترافي ومختصر وواضح مع الحفاظ على الزخرفة."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7
    })
  })

  const data = await response.json()

  return data?.choices?.[0]?.message?.content || "لم أستطع توليد رد."
}
