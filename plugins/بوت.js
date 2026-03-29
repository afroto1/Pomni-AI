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

    if (!result) throw new Error("Empty response")

    await m.reply(`
╮───────────────────────╭ـ
${result}
╰───────────────────────╯
`)
  } catch (e) {
    console.log("AI ERROR:", e)
    await m.reply("❌ حدث خطأ في جلب الرد من الذكاء الاصطناعي")
  }
}

handler.help = ["بوت"]
handler.tags = ["ai"]
handler.command = /^(بوت)$/i

export default handler

/* ================== AI FUNCTION ================== */

async function askAI(text) {
  const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_new_tokens: 100,
        return_full_text: false
      }
    })
  })

  const data = await response.json()

  console.log("API RESPONSE:", data)

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text
  }

  if (data?.generated_text) {
    return data.generated_text
  }

  if (data?.error) {
    return "⚠️ خطأ من السيرفر: " + data.error
  }

  return "لم يتم الحصول على رد من الذكاء الاصطناعي."
}
