let handler = async (m, { conn, text }) => {
  // لو كتب "هل" فقط
  if (!text) {
    return m.reply('*أدخــل الـسـؤال !*')
  }

  let sender = m.sender

  let answers = [
    'احــتـمـال قـلـيـل',
    'نــعم بـالـتـأكـيد',
    'لا أعـتـقـد',
    'مــستـحـيــل',
    'غــالـبـاً نــعــم',
    'مــمـكـن'
  ]

  let answer = answers[Math.floor(Math.random() * answers.length)]
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

// 👇 الإضافة فقط بدون تغيير الكود
handler.category = 'games'
handler.usage = ['هل']

export default handler