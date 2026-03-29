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

  let sender = m.sender

  await m.reply('جاري التفكير... 🤖')

  try {

    let res = await fetch(`https://api.simsimi.vn/v2/simtalk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `text=${encodeURIComponent(text)}&lc=ar`
    })

    let data = await res.json()

    let aiAnswer = data?.message || "لا يوجد رد"

    await conn.sendMessage(m.chat, {
      text: `
╮───────────────────────╭ـ
${aiAnswer}
╰───────────────────────╯
`,
      mentions: [sender]
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply('❌ حدث خطأ في الذكاء الاصطناعي')
  }
}

handler.command = /^بوت$/i
handler.group = true
handler.tags = ['ai']

export default handler
