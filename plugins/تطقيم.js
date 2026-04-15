import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/lib/%D8%B7%D9%82%D9%85%20%D8%AD%D8%A8.json')
    if (!res.ok) throw new Error(`فشل تحميل JSON: ${res.status}`)

    let data = await res.json()
    if (!Array.isArray(data) || !data.length) throw new Error('البيانات فارغة أو غير صالحة')

    let cita = data[Math.floor(Math.random() * data.length)]

    let resCowo = await fetch(cita.cowo)
    if (!resCowo.ok) throw new Error(`فشل تحميل صورة الولد: ${resCowo.status}`)
    let cowi = Buffer.from(await resCowo.arrayBuffer())

    let resCewe = await fetch(cita.cewe)
    if (!resCewe.ok) throw new Error(`فشل تحميل صورة البنت: ${resCewe.status}`)
    let ciwi = Buffer.from(await resCewe.arrayBuffer())

    await conn.sendFile(m.chat, cowi, 'boy.jpg', '*ولد* 🧑', m)
    await conn.sendFile(m.chat, ciwi, 'girl.jpg', '*بنت* 👧', m)

  } catch (e) {
    console.error(e)
    m.reply(`حصل خطأ:\n${e.message}`)
  }
}

handler.help = ['alsoltan bot']
handler.tags = ['alsoltan bot']
handler.command = /^طقم|تطقيم$/i
handler.limit = true

export default handler
