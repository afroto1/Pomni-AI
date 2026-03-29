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

    let aiAnswer = await askAI(text)

    if (!aiAnswer) throw new Error("Empty AI response")

    let percent = Math.floor(Math.random() * 101)

    let msg = `*هــل ${text}*\n\n*الــأجــابـه :* ${aiAnswer}\n*الـنـسـبـة :* ${percent}%`

    await conn.sendMessage(m.chat, {
      text: msg,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.log("ERROR:", e)
    m.reply("❌ فشل في جلب الرد من الذكاء الاصطناعي")
  }
}

handler.command = /^هل$/i
handler.group = true
handler.tags = ['fun']

export default handler

/* ================== AI ================== */

async function askAI(question) {

  let Baseurl = "https://vipcleandx.xyz/"

  let payload = {
    list: [
      {
        content: `أجب بكلمة واحدة فقط (نعم أو لا أو ربما): ${question}`,
        role: "user",
        time: formatTime(),
        isMe: true
      }
    ],
    id: generateRandomString(21),
    title: question,
    prompt: "",
    temperature: 0.5,
    models: "0",
    continuous: true
  }

  let res = await fetch(Baseurl + "v1/chat/gpt/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": Baseurl
    },
    body: JSON.stringify(payload)
  })

  let data = await res.text()

  console.log("RAW API RESPONSE:", data)

  try {
    let json = JSON.parse(data)

    // محاولة استخراج الرد بأكثر من شكل
    let result =
      json?.data ||
      json?.message ||
      json?.content ||
      json?.result

    return result || "لا يوجد رد من الـ API"

  } catch (err) {
    console.log("PARSE ERROR:", err)
    return data || "خطأ في تحليل الرد"
  }
}

/* ================== HELPERS ================== */

function generateRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function formatTime() {
  let d = new Date()
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}
