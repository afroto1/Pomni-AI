let handler = async (m, { conn }) => {

    const vn = 'https://files.catbox.moe/iaimvj.mp3';

    // إظهار حالة التسجيل
    await conn.sendPresenceUpdate('recording', m.chat);

    // انتظار 2 ثانية عشان يبان أنه بيسجل
    await new Promise(resolve => setTimeout(resolve, 2000));

    // إرسال الصوت كـ voice note
    await conn.sendMessage(
        m.chat,
        {
            audio: { url: vn },
            ptt: true,
            mimetype: 'audio/ogg; codecs=opus', // الأفضل للريكورد
            fileName: 'recording.ogg'
        },
        { quoted: m }
    );

    // إيقاف حالة التسجيل (اختياري)
    await conn.sendPresenceUpdate('paused', m.chat);
};

handler.help = ['notification'];
handler.tags = ['notification'];
handler.command = ['الوداع', 'بودعك'];
handler.customPrefix = /^(بودعك|الوداع)$/i;

export default handler;
