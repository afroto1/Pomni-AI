let handler = async (m, { conn, text }) => {

  if (!text) throw '*أدخــل الـسـؤال !*'

  let msg = `*تــم اســتـلام ســؤالـك :* ${text}`

  await conn.sendMessage(m.chat, {
    text: msg,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.command = /^بوت$/i
handler.group = true
handler.tags = ['test']

export default handler
