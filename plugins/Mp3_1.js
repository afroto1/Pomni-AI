let handler = async (m, { conn }) => {
    const vn = './media/بودعك.mp3'

    conn.sendPresenceUpdate('recording', m.chat)

    await conn.sendMessage(
        m.chat,
        {
            audio: { url: vn },
            ptt: true,
            mimetype: 'audio/mpeg',
            fileName: 'deja de llorar.mp3'
        },
        { quoted: m }
    )
}

// الأمر يشتغل مباشرة بدون prefix
handler.command = /^(بودعك|الوداع)$/i

export default handler
