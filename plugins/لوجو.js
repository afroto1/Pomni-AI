import fetch from "node-fetch";

let timeout = 60000;
let poin = 4999;

async function handler(m, { conn }) {
  if (!global.tebaklogo) global.tebaklogo = { games: {}, scores: {} };

  // لو فيه لعبة شغالة في نفس الشات
  if (global.tebaklogo.games[m.chat]) {
    clearTimeout(global.tebaklogo.games[m.chat].timeout);
    delete global.tebaklogo.games[m.chat];
  }

  // جلب البيانات
  const res = await fetch("https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json");
  const data = await res.json();

  const q = data[Math.floor(Math.random() * data.length)];

  // إرسال السؤال (صورة اللوجو)
  await conn.sendMessage(m.chat, {
    image: { url: q.data.image },
    caption: `
╭─┈─┈─┈─⟞💎⟝─┈─┈─┈─╮
┃ *ما اسم هذا الشعار؟*
┃
┃ 💰 الجائزة: ${poin} XP
┃ ⏳ الوقت: ${(timeout / 1000)} ثانية
╰─┈─┈─┈─⟞💎⟝─┈─┈─┈─╯
`.trim()
  }, { quoted: m });

  if (!global.tebaklogo.scores[m.chat]) global.tebaklogo.scores[m.chat] = {};

  // حفظ اللعبة
  global.tebaklogo.games[m.chat] = {
    answer: q.data.jawaban.toLowerCase().trim(),
    timeout: setTimeout(() => {
      if (global.tebaklogo.games[m.chat]) {
        m.reply(`⏰ انتهى الوقت\nالإجابة الصحيحة: *${q.data.jawaban}*`);
        delete global.tebaklogo.games[m.chat];
        delete global.tebaklogo.scores[m.chat];
      }
    }, timeout)
  };
}

handler.command = ['tebaklogo', 'لوجو'];
export default handler;

/* ================= BEFORE ================= */

handler.before = async (m, { conn }) => {
  if (!m.text) return;
  if (!global.tebaklogo?.games?.[m.chat]) return;

  const game = global.tebaklogo.games[m.chat];
  const player = m.sender;

  if (m.text.trim().toLowerCase() !== game.answer) return;

  clearTimeout(game.timeout);
  delete global.tebaklogo.games[m.chat];

  if (!global.tebaklogo.scores[m.chat][player]) {
    global.tebaklogo.scores[m.chat][player] = 0;
  }

  global.tebaklogo.scores[m.chat][player] += 1;

  let total = 0;
  for (let id in global.tebaklogo.scores[m.chat]) {
    total += global.tebaklogo.scores[m.chat][id];
  }

  // لما توصل الجولة 20
  if (total >= 20) {
    const entries = Object.entries(global.tebaklogo.scores[m.chat])
      .sort((a, b) => b[1] - a[1]);

    const sorted = entries.map(
      ([id, score], i) => `${i + 1}. @${id.split('@')[0]} - ${score} نقطة`
    );

    const mentions = entries.map(([id]) => id);

    await conn.sendMessage(m.chat, {
      text: `🏆 *الفائزون*\n\n${sorted.join('\n')}`,
      mentions
    });

    delete global.tebaklogo.scores[m.chat];
    return;
  }

  await m.reply(`✅ إجابة صحيحة!\nنقاطك: *${global.tebaklogo.scores[m.chat][player]}*`);

  // تشغيل سؤال جديد تلقائي
  handler(m, { conn });
};
