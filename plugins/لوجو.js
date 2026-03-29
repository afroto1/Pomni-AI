async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" },
            { name: "instagram", img: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.png" },
            { name: "whatsapp", img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
            { name: "youtube", img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
            { name: "twitter", img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" },
            { name: "tiktok", img: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
            { name: "snapchat", img: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg" },
            { name: "telegram", img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" },
            { name: "linkedin", img: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
            { name: "pinterest", img: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" },
            { name: "spotify", img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
            { name: "netflix", img: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
            { name: "amazon", img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
            { name: "paypal", img: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
            { name: "discord", img: "https://upload.wikimedia.org/wikipedia/commons/8/88/Discord_logo.svg" },
            { name: "reddit", img: "https://upload.wikimedia.org/wikipedia/en/5/58/Reddit_logo_new.svg" },
            { name: "skype", img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Skype_icon_2021.svg" },
            { name: "viber", img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Viber_logo.svg" },
            { name: "slack", img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png" },
            { name: "zoom", img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg" },
            { name: "google", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
            { name: "apple", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
            { name: "github", img: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
            { name: "twitch", img: "https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg" },
            { name: "ebay", img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" },
            { name: "wechat", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/WeChat_Logo.svg" },
            { name: "messenger", img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Facebook_Messenger_logo_2020.svg" },
            { name: "quora", img: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Quora_logo_2015.svg" },
            { name: "tripadvisor", img: "https://upload.wikimedia.org/wikipedia/commons/0/07/Tripadvisor_logo.svg" },
            { name: "uber", img: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg" },

            // 🔥 إضافات جديدة
            { name: "airbnb", img: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" },
            { name: "nike", img: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
            { name: "adidas", img: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
            { name: "samsung", img: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
            { name: "xiaomi", img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
            { name: "oppo", img: "https://upload.wikimedia.org/wikipedia/commons/0/0f/OPPO_LOGO_2019.svg" },
            { name: "huawei", img: "https://upload.wikimedia.org/wikipedia/commons/0/04/Huawei_Logo.svg" },
            { name: "lenovo", img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Lenovo_logo_2015.svg" },
            { name: "dell", img: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
            { name: "hp", img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" }
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
