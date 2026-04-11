let handler = async (m, { conn, text }) => {
  if (!text) throw '*أدخــل الـسـؤال !*'

  let sender = m.sender

  // اختيار عشوائي مباشرة بدون دالة خارجية
  let answers = [
    'احــتـمـال قـلـيـل',
    'نــعم بـالـتـأكـيد',
    'لا أعـتـقـد',
    'مــستـحـيــل',
    'غــالـبـاً نــعــم',
    'مــمـكـن'
  ]

  let answer = answers[Math.floor(Math.random() * answers.length)]

  // نسبة مئوية
  let percent = Math.floor(Math.random() * 101)

  let msg = `*هــل ${text}*\n\n*الــأجــابـه :* ${answer}\n*الـنـسـبـة :* ${percent}%`

  await conn.sendMessage(m.chat, {
    text: msg,
    mentions: [sender]
  }, { quoted: m })
}

handler.command = /^هل$/i
handler.group = true
handler.tags = ['fun']

export default handler
