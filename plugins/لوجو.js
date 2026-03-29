async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "instagram", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "whatsapp", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "twitter", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "snapchat", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "linkedin", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "tiktok", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "youtube", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "google", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "spotify", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "amazon", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "paypal", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "netflix", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "airbnb", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "uber", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "discord", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "reddit", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "shazam", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "telegram", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "pinterest", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "twitch", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "skype", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "viber", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "soundcloud", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "snapseed", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "evernote", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "skyscanner", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "tripadvisor", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "zoom", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "quora", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." },
            { name: "slack", img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAF..." }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭ـ
│ ❓ ما اسم هذا التطبيق؟
│ ⏳ الوقت: 30 ثانية
│ 💰 الجائزة: 500 نقطة
╯───────────────────────╰ـ
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: item.name,
            image: item.img,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, { text: `⏰ انتهى الوقت\n✅ الإجابة: ${ans}` }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply('❌ حدث خطأ في اللعبة');
    }
}

handler.before = async (m) => {
    if (!m.text) return false;
    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    let userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        await m.reply(`🎉 إجابة صحيحة!\n💰 +500 نقطة\n> اكتب *لوجو* للعب مرة أخرى`);
        return true;
    } else if (m.quoted && m.quoted.id === game.messageId) {
        await m.reply('❌ إجابة خاطئة\n🔁 حاول مرة أخرى');
        return true;
    }

    return false;
};

handler.command = ['لوجو','logo'];
handler.category = 'games';

export default handler;
