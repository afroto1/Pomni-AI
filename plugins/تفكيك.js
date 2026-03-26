import fs from 'fs';

let timeout = 60000;
let poin = 500;

async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }

    try {
        let data = JSON.parse(fs.readFileSync(`./src/game/miku.json`));
        let random = data[Math.floor(Math.random() * data.length)];

        let question = random.question;
        let answer = random.response.toLowerCase();

        let message = await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🧩 *تفكيك*
│ ❓ *${question}*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : ${poin} نقطة*
╯───────────────────────╰ـ
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: answer,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    let ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة : ${ans}*
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, timeout)
        };

    } catch (e) {
        console.log(e);
    }
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    if (!global.gameActive) global.gameActive = {};

    const game = global.gameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    let userAnswer = m.text.toLowerCase().trim();

    // انسحاب
    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب*
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
            text: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *كسبت ${poin} نقطة*
╯───────────────────────╰ـ

> اكتب *.تفكيك* عشان تلعب تاني
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة غلط حاول تاني*");
        return true;
    }
};

handler.help = ['تفكيك'];
handler.tags = ['game'];
handler.command = /^(تفكيك)$/i;

export default handler;
