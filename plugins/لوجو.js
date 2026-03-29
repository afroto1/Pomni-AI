import fetch from 'node-fetch';

let timeout = 60000;
let poin = 4999;

async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const res = await fetch('https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json');

        if (!res.ok) throw new Error('fetch failed');

        const text = await res.text();
        const json = JSON.parse(text);

        // دعم أكثر من شكل للبيانات
        const data = Array.isArray(json) ? json : json.data;

        if (!Array.isArray(data)) throw new Error('invalid data format');

        const random = data[Math.floor(Math.random() * data.length)];

        const image = random.data.image;
        const answer = random.data.jawaban.toLowerCase();

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ ❓ *ما هو اسم هذا الشعار؟*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : ${poin} XP*
╯───────────────────────╰ـ

> اكتب الإجابة أو "انسحاب"
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer,
            image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة هي : ${ans}*
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, timeout)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حصل خطأ في جلب السؤال");
    }
}

handler.before = async (m, { conn }) => {
    if (!m.text) return false;
    if (!global.gameActive) global.gameActive = {};

    const game = global.gameActive[m.chat];
    if (!game) return false;

    if (!m.quoted || m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    // انسحاب
    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب من اللعبة*
╯───────────────────────╰ـ
            `.trim()
        });

        return true;
    }

    // إجابة صحيحة
    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *كسبت ${poin} XP*
╯───────────────────────╰ـ
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة خاطئة حاول مرة أخرى*");
        return true;
    }
};

handler.help = ['لوجو'];
handler.tags = ['game'];
handler.command = /^(لوجو)$/i;

export default handler;
