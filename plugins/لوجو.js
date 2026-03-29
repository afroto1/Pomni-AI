async function handler(m, { conn }) {
    if (!global.gameActive) {
        global.gameActive = {};
    }
    
    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }
    
    // رابط JSON الجديد للوجوهات
    const data = await (await fetch("https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json")).json();
    
    const app = data[Math.floor(Math.random() * data.length)];
    
    const message = await conn.sendMessage(m.chat, {
        image: { url: app.img },
        caption: "🧠 *خمن اللوجو*\n\nلديك 30 ثانية للإجابة\nرد على الرسالة باسم التطبيق"
    });
    
    global.gameActive[m.chat] = {
        answer: app.name.toLowerCase(),
        image: app.img,
        messageId: message?.key?.id,
        timeout: setTimeout(() => {
            if (global.gameActive[m.chat]) {
                const appName = global.gameActive[m.chat].answer;
                delete global.gameActive[m.chat];
                conn.sendMessage(m.chat, { 
                    text: `⏰ *انتهى الوقت*\nالإجابة هي: *${appName}*` 
                }, m);
            }
        }, 30000)
    };
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;
    
    if (!global.gameActive) {
        global.gameActive = {};
    }
    
    const game = global.gameActive[m.chat];
    if (!game) return false;
    
    if (m.quoted.id !== game.messageId) return false;
    
    const userAnswer = m.text.toLowerCase().trim();
    
    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `🎉 *إجابة صحيحة!*\nأحسنت 👏 هذا هو اللوجو\n\n💡 جرب تاني\nاكتب *${m.prefix || '.'}لوجو*`
        });
        return true;
    } else {
        await m.reply("*❌ إجابة خاطئة، حاول مرة أخرى*");
        return true;
    }
};

handler.command = ['لوجو','logo'];
handler.category = "games";

export default handler;
