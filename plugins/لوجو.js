import axios from 'axios';

let TIMEOUT = 60000; // 60 ثانية
let POINTS = 500;   // نقاط اللعبة

async function handler(m, { conn }) {
    if (!global.logoGameActive) global.logoGameActive = {};

    // مسح أي لعبة سابقة
    if (global.logoGameActive[m.chat]) {
        clearTimeout(global.logoGameActive[m.chat].timeout);
        delete global.logoGameActive[m.chat];
    }

    try {
        // رابط JSON مباشر
        const url = 'https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json';
        const res = await axios.get(url);
        const data = res.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const random = data[Math.floor(Math.random() * data.length)];
        const question = random.question;
        const image = random.image;
        const answer = random.response.toLowerCase();

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╭─━─━─━─━─━─╮
❓ *السؤال:* ${question}
⏳ *الوقت:* 60 ثانية
💰 *الجائزة:* ${POINTS} نقطة
╰─━─━─━─━─━─╯
            `.trim()
        });

        // حفظ حالة اللعبة
        global.logoGameActive[m.chat] = {
            answer,
            image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.logoGameActive[m.chat]) {
                    const ans = global.logoGameActive[m.chat].answer;
                    delete global.logoGameActive[m.chat];
                    conn.sendMessage(m.chat, {
                        text: `⏰ انتهى الوقت!\n✅ الإجابة الصحيحة: ${ans}`
                    }, { quoted: m });
                }
            }, TIMEOUT)
        };

    } catch (e) {
        console.log("❌ خطأ في تحميل JSON أو اللعبة:", e);
    }
}

// التعامل مع الإجابة
handler.before = async (m) => {
    if (!m.quoted || !m.text) return false;

    const game = global.logoGameActive[m.chat];
    if (!game || m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];
        await m.reply("🚪 تم الانسحاب من اللعبة");
        return true;
    }

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];
        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `🎉 إجابة صحيحة!\n💰 كسبت ${POINTS} نقطة\n> اكتب *لوجو* لتلعب مرة أخرى`
        });
        return true;
    } else {
        await m.reply("❌ إجابة خاطئة، حاول مرة أخرى");
        return true;
    }
};

handler.help = ['لوجو'];
handler.tags = ['game'];
handler.command = /^(لوجو)$/i;

export default handler;
