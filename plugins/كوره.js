import fs from 'fs';
import axios from 'axios';

let timeout = 60000; // 60 ثانية
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};

    let id = m.chat;

    // التحقق إذا كان هناك سؤال جاري
    if (id in conn.tekateki) {
        conn.reply(m.chat, `
╮───────────────────────╭ـ
│ *في سؤال لسه مجاوبتش عليه يا فاشل* ┃❌
╯───────────────────────╰ـ`.trim(), conn.tekateki[id][0]);
        throw false;
    }

    try {
        const fileId = '1pOFDptzcYxRUnxM_91YeFr7T2fRsQXqO';
        const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const res = await axios.get(url);

        if (res.data && Array.isArray(res.data)) {
            let tekateki = res.data;
            let json = tekateki[Math.floor(Math.random() * tekateki.length)];

            let img = json.image;
            let answer = json.response.toLowerCase();
            let questions = json.question || 'من هو هذا اللاعب؟';

            let caption = `
╮───────────────────────╭ـ
│ ❓ *السـؤال : ${questions}*
│ ⏳ *الـوقـت : ${(timeout / 1000).toFixed(0)} ثانية*
│ 💰 *الـجـائـزة : ${poin} نقطه*
│ 🏳️ *الانسـحاب : استخدم [انسحاب] للانسحاب من اللعبة*
╯───────────────────────╰ـ`.trim();

            // إرسال السؤال
            let sentMsg = await conn.sendMessage(m.chat, { image: { url: img }, caption: caption }, { quoted: m });

            // حفظ بيانات اللعبة
            conn.tekateki[id] = [
                sentMsg, // رسالة السؤال
                json,    // بيانات السؤال
                poin,    // النقاط
                setTimeout(async () => {
                    if (conn.tekateki[id]) {
                        await conn.reply(m.chat, `
╮───────────────────────╭ـ
│ ❎ *خلص الوقت وانت زي منت فاشل مجوبتش*
│ ✅ *الاجابه هي : ${answer}*
╯───────────────────────╰ـ`.trim(), conn.tekateki[id][0]);
                        delete conn.tekateki[id];
                    }
                }, timeout)
            ];

        } else {
            console.error('The received data is not a valid JSON array.');
        }
    } catch (error) {
        console.error('Error fetching data from Google Drive:', error);
    }
};

// تابع للتحقق من الإجابات
handler.before = async (m, { conn }) => {
    let id = m.chat;
    if (conn.tekateki[id]) {
        let userAnswer = m.text.trim().toLowerCase();
        let correctAnswer = conn.tekateki[id][1].response.toLowerCase();

        if (userAnswer === correctAnswer) {
            await conn.reply(m.chat, `
✅ *إجابتك صحيحة!*
💰 لقد ربحت ${conn.tekateki[id][2]} نقطة!
`.trim(), conn.tekateki[id][0]);
            clearTimeout(conn.tekateki[id][3]);
            delete conn.tekateki[id];
            return true; // منع أي معالجة أخرى
        } else {
            await conn.reply(m.chat, '❌ إجابة خاطئة حاول مرة أخرى!', conn.tekateki[id][0]);
            return true;
        }
    }
};

handler.help = ['acertijo'];
handler.tags = ['game'];
handler.command = /^(كوره)$/i;

export default handler;
