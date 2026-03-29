async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://cdn.simpleicons.org/facebook/1877F2" },
            { name: "instagram", img: "https://cdn.simpleicons.org/instagram/E4405F" },
            { name: "whatsapp", img: "https://cdn.simpleicons.org/whatsapp/25D366" },
            { name: "youtube", img: "https://cdn.simpleicons.org/youtube/FF0000" },
            { name: "twitter", img: "https://cdn.simpleicons.org/twitter/1DA1F2" },
            { name: "tiktok", img: "https://cdn.simpleicons.org/tiktok/000000" },
            { name: "snapchat", img: "https://cdn.simpleicons.org/snapchat/FFFC00" },
            { name: "telegram", img: "https://cdn.simpleicons.org/telegram/26A5E4" },
            { name: "linkedin", img: "https://cdn.simpleicons.org/linkedin/0A66C2" },
            { name: "spotify", img: "https://cdn.simpleicons.org/spotify/1DB954" },
            { name: "netflix", img: "https://cdn.simpleicons.org/netflix/E50914" },
            { name: "amazon", img: "https://cdn.simpleicons.org/amazon/FF9900" },
            { name: "paypal", img: "https://cdn.simpleicons.org/paypal/00457C" },
            { name: "discord", img: "https://cdn.simpleicons.org/discord/5865F2" },
            { name: "reddit", img: "https://cdn.simpleicons.org/reddit/FF4500" },
            { name: "skype", img: "https://cdn.simpleicons.org/skype/00AFF0" },
            { name: "viber", img: "https://cdn.simpleicons.org/viber/7360F2" },
            { name: "slack", img: "https://cdn.simpleicons.org/slack/4A154B" },
            { name: "zoom", img: "https://cdn.simpleicons.org/zoom/2D8CFF" },
            { name: "google", img: "https://cdn.simpleicons.org/google/4285F4" },
            { name: "apple", img: "https://cdn.simpleicons.org/apple/000000" },
            { name: "github", img: "https://cdn.simpleicons.org/github/181717" },
            { name: "twitch", img: "https://cdn.simpleicons.org/twitch/9146FF" },
            { name: "ebay", img: "https://cdn.simpleicons.org/ebay/E53238" },
            { name: "wechat", img: "https://cdn.simpleicons.org/wechat/07C160" },
            { name: "messenger", img: "https://cdn.simpleicons.org/messenger/00B2FF" },
            { name: "quora", img: "https://cdn.simpleicons.org/quora/B92B27" },
            { name: "tripadvisor", img: "https://cdn.simpleicons.org/tripadvisor/34E0A1" },
            { name: "uber", img: "https://cdn.simpleicons.org/uber/000000" },
            { name: "airbnb", img: "https://cdn.simpleicons.org/airbnb/FF5A5F" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭
│ ❓ *ما اسم هذا التطبيق؟*
│ ⏳ *الوقت:* 30 ثانية
│ 💰 *الجائزة:* 500 نقطة
╯───────────────────────╰
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: item.name,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, {
                        text: `⏰ انتهى الوقت\n✅ *الإجابة:* ${ans}`
                    }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حدث خطأ في اللعبة");
    }
}

handler.before = async (m) => {
    if (!m.text) return false;

    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    const answer = m.text.toLowerCase().trim();

    if (answer.includes(game.answer)) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await m.reply(`
🎉 *إجابة صحيحة!*  
💰 +500 نقطة
        `);
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
