async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { answers: ["facebook","fb","فيسبوك","فيس"], domain: "facebook.com" },
            { answers: ["instagram","insta","ig","انستجرام"], domain: "instagram.com" },
            { answers: ["whatsapp","واتساب","واتس","wa"], domain: "whatsapp.com" },
            { answers: ["youtube","yt","يوتيوب"], domain: "youtube.com" },
            { answers: ["twitter","x","تويتر"], domain: "twitter.com" },
            { answers: ["tiktok","تيك توك","tik tok"], domain: "tiktok.com" },
            { answers: ["snapchat","سناب","سناب شات"], domain: "snapchat.com" },
            { answers: ["telegram","تلجرام"], domain: "telegram.org" },
            { answers: ["discord","ديسكورد"], domain: "discord.com" },
            { answers: ["linkedin","لينكدان"], domain: "linkedin.com" },
            { answers: ["spotify","سبوتيفاي"], domain: "spotify.com" },
            { answers: ["netflix","نتفليكس"], domain: "netflix.com" },
            { answers: ["amazon","امازون"], domain: "amazon.com" },
            { answers: ["paypal","بايبال"], domain: "paypal.com" },
            { answers: ["reddit","ريديت"], domain: "reddit.com" },
            { answers: ["twitch","تويتش"], domain: "twitch.tv" },
            { answers: ["github","جيت هاب"], domain: "github.com" },
            { answers: ["google","جوجل"], domain: "google.com" },
            { answers: ["apple","ابل"], domain: "apple.com" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: `https://logo.clearbit.com/${item.domain}` },
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
            answers: item.answers,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answers[0];
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


// 🔥 دالة الذكاء (similarity)
function similarity(s1, s2) {
    let longer = s1.length > s2.length ? s1 : s2;
    let shorter = s1.length > s2.length ? s2 : s1;
    let longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


// ✅ التحقق
handler.before = async (m) => {
    if (!m.text) return false;

    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    const userAnswer = m.text.toLowerCase().trim();

    let bestScore = 0;
    let isCorrect = false;

    for (let ans of game.answers) {
        const score = similarity(userAnswer, ans);

        if (score > bestScore) bestScore = score;

        if (userAnswer === ans || score >= 0.7) {
            isCorrect = true;
            break;
        }
    }

    if (isCorrect) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await m.reply(`
🎉 *إجابة صحيحة!*  
📊 نسبة التطابق: ${(bestScore * 100).toFixed(0)}%
💰 +500 نقطة
        `);
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
