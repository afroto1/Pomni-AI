import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`مرحبا 👋\nاكتب أي سؤال بعد الأمر "بوت"`)
  }

  await m.reply('جاري التفكير... 🤖')

  try {
    let res = await fetch("https://vipcleandx.xyz/v1/chat/gpt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        list: [
          {
            content: text,
            role: "user"
          }
        ],
        prompt: "You are a helpful AI assistant."
      })
    })

    let data = await res.text()
    let json

    try {
      json = JSON.parse(data)
    } catch {
      return m.reply("❌ API لم يرجع JSON\n" + data)
    }

    let reply = json?.data || json?.message || "❌ لا يوجد رد"

    await conn.sendMessage(m.chat, { text: reply }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply("❌ خطأ في الاتصال بالذكاء الاصطناعي")
  }
}

handler.command = /^بوت$/i
export default handler
