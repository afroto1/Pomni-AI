import axios from 'axios';

let timeout = 60000; // 60 ثانية
let poin = 500; // نقاط اللعبة

async function handler(m, { conn }) {
    if (!global.logoGameActive) global.logoGameActive = {};

    const oldGame = global.logoGameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.logoGameActive[m.chat];
    }

    try {
        // قائمة أكثر من 40 تطبيق مشهور
        const logos = [
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png", response: "فيسبوك" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", response: "واتساب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png", response: "يوتيوب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Snapchat_logo.svg", response: "سناب شات" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Instagram_logo_2022.svg", response: "انستغرام" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/TikTok_logo.svg", response: "تيك توك" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Twitter_Logo_2012.svg", response: "تويتر" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/LinkedIn_logo_initials.png", response: "لينكدإن" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Reddit_logo.svg", response: "ريديت" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Spotify_logo_with_text.svg", response: "سبوتيفاي" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Telegram_logo.svg", response: "تيليجرام" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Netflix_2015_logo.svg", response: "نتفلكس" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Amazon_icon.svg", response: "أمازون" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Google_Play_icon_(2021).svg", response: "جوجل بلاي" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Apple_logo_black.svg", response: "آبل" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Microsoft_logo_%282012%29.svg", response: "مايكروسوفت" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Discord_logo.svg", response: "ديسكورد" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Pinterest_logo.svg", response: "بينتيريست" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/PayPal.svg", response: "بايبال" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Adobe_Corporate_logo.svg", response: "أدوبي" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Facebook_Messenger_logo_2018.svg", response: "فيسبوك ماسنجر" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/6/60/Skype_logo.svg", response: "سكايب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Dropbox_logo_2017.svg", response: "دروبوكس" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tinder_logo.svg", response: "تيندر" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Uber_logo_2018.svg", response: "أوبر" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Airbnb_Logo_Bélo.svg", response: "إير بي إن بي" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/3/37/PayPal_logo.svg", response: "بايبال" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Google_Maps_logo.svg", response: "خرائط جوجل" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Apple_Music_logo.svg", response: "آبل ميوزيك" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/1/12/WhatsApp_Icon.png", response: "واتساب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Gmail_icon_%282020%29.svg", response: "جيميل" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Google_Chrome_icon.png", response: "كروم" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/5/59/LinkedIn_icon.svg", response: "لينكدإن" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Instagram_logo.svg", response: "انستغرام" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/8/83/Google_Logo.svg", response: "جوجل" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/3/31/Spotify_icon.png", response: "سبوتيفاي" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Netflix_2015_icon.png", response: "نتفلكس" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Snapchat_logo_icon.png", response: "سناب شات" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/WhatsApp_icon.png", response: "واتساب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/9/99/Discord_icon.png", response: "ديسكورد" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/TikTok_icon.png", response: "تيك توك" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_logo.png", response: "يوتيوب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Apple_App_Store_logo.svg", response: "آب ستور" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Google_Play_icon.png", response: "جوجل بلاي" }
        ];

        const random = logos[Math.floor(Math.random() * logos.length)];
        const question = random.question;
        const image = random.image;
        const answer = random.response.toLowerCase();

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ ❓ *السؤال : ${question}*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : ${poin} نقطة*
╯───────────────────────╰ـ
            `.trim()
        });

        global.logoGameActive[m.chat] = {
            answer: answer,
            image: image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.logoGameActive[m.chat]) {
                    const ans = global.logoGameActive[m.chat].answer;
                    delete global.logoGameActive[m.chat];

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
    }
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    if (!global.logoGameActive) global.logoGameActive = {};

    const game = global.logoGameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب من اللعبة*
╯───────────────────────╰ـ
            `.trim()
        });
        return true;
    }

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *كسبت ${poin} نقطة*
╯───────────────────────╰ـ

> اكتب *لوجو* عشان تلعب تاني
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة غلط حاول تاني*");
        return true;
    }
};

handler.help = ['لوجو'];
handler.tags = ['game'];
handler.command = /^(لوجو)$/i;

export default handler;
