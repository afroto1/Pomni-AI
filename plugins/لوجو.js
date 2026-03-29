import fetch from "node-fetch";

async function getImage(query, backup) {
    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_ACCESS_KEY`);
        const json = await res.json();
        if (json.results && json.results.length > 0) {
            return json.results[Math.floor(Math.random() * json.results.length)].urls.regular;
        }
    } catch (e) {
        console.log("Image API Error:", e);
    }
    return backup; // fallback
}

async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", backup: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" },
            { name: "instagram", backup: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.png" },
            { name: "whatsapp", backup: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp_Logo.png" },
            { name: "youtube", backup: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.png" },
            { name: "twitter", backup: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Twitter_Logo_2012.png" },
            { name: "tiktok", backup: "https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.png" },
            { name: "snapchat", backup: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.png" },
            { name: "telegram", backup: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.png" },
            { name: "linkedin", backup: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
            { name: "pinterest", backup: "https://upload.wikimedia.org/wikipedia/commons/3/35/Pinterest_logo.png" },
            { name: "spotify", backup: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.png" },
            { name: "netflix", backup: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.png" },
            { name: "amazon", backup: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.png" },
            { name: "paypal", backup: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg.png" },
            { name: "discord", backup: "https://upload.wikimedia.org/wikipedia/commons/8/88/Discord_logo.png" },
            { name: "reddit", backup: "https://upload.wikimedia.org/wikipedia/en/5/58/Reddit_logo_new.png" },
            { name: "skype", backup: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Skype_icon_2021.png" },
            { name: "viber", backup: "https://upload.wikimedia.org/wikipedia/commons/4/45/Viber_logo.png" },
            { name: "slack", backup: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png" },
            { name: "zoom", backup: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Zoom_Communications_Logo.png" },
            { name: "google", backup: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.png" },
            { name: "apple", backup: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.png" },
            { name: "github", backup: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.png" },
            { name: "twitch", backup: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Twitch_logo_2019.png" },
            { name: "ebay", backup: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.png" },
            { name: "wechat", backup: "https://upload.wikimedia.org/wikipedia/commons/7/79/WeChat_Logo.png" },
            { name: "messenger", backup: "https://upload.wikimedia.org/wikipedia/commons/8/83/Facebook_Messenger_logo_2020.png" },
            { name: "quora", backup: "https://upload.wikimedia.org/wikipedia/commons/3/32/Quora_logo_2015.png" },
            { name: "tripadvisor", backup: "https://upload.wikimedia.org/wikipedia/commons/0/07/Tripadvisor_logo.png" },
            { name: "uber", backup: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
            { name: "airbnb", backup: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg.png" },
            { name: "nike", backup: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg.png" },
            { name: "adidas", backup: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg.png" },
            { name: "samsung", backup: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg.png" },
            { name: "xiaomi", backup: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg.png" },
            { name: "oppo", backup: "https://upload.wikimedia.org/wikipedia/commons/0/0f/OPPO_LOGO_2019.svg.png" },
            { name: "huawei", backup: "https://upload.wikimedia.org/wikipedia/commons/0/04/Huawei_Logo.svg.png" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        // 🔥 بحث ذكي للصورة
        const query = `${item.name} app icon logo play store`;
        const image = await getImage(query, item.backup);

        const msg = await conn.sendMessage(m.chat, {
            image: { url: image },
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
            answer: item.name.toLowerCase(),
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, { text: `⏰ انتهى الوقت\n✅ *الإجابة:* ${ans}` }, { quoted: m });
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

    if (answer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await m.reply(`
🎉 *إجابة صحيحة!*  
💰 +500 نقطة

> اكتب *لوجو* للعب مرة أخرى
        `);
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
