import fs from 'fs';
import path from 'path';

const ff = async (m, { conn, command }) => {
    try {
        // 🔥 تأكيد إن الأمر اشتغل
        console.log("Command received:", command);

        const filePath = path.join(process.cwd(), 'settings', 'database.json');

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ ban: {} }, null, 2));
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const database1 = JSON.parse(data);

        if (!database1.ban) database1.ban = {};
        if (!global.database) global.database = {};
        if (!global.database.ban) global.database.ban = {};

        // 🎯 الهدف (لازم ريبلاي)
        let target = m.quoted?.sender;

        // ❌ بدون ريبلاي
        if (!target) {
            return m.reply("❌ رد على الشخص اللى عاوز تحظرو من استخدام البوت");
        }

        // ================= فك =================
        if (command === "فك") {
            if (database1.ban[target]) {
                delete database1.ban[target];
                delete global.database.ban[target];

                fs.writeFileSync(filePath, JSON.stringify(database1, null, 2));

                return conn.sendMessage(
                    m.chat,
                    {
                        text: `✅ تم فك حظر @${target.split('@')[0]}`,
                        mentions: [target]
                    },
                    { quoted: m }
                );
            } else {
                return m.reply("❌ هذا المستخدم ليس محظور");
            }
        }

        // ================= حظر =================
        if (command === "حظر") {
            if (database1.ban[target]) {
                return m.reply("❌ المستخدم بالفعل محظور");
            }

            database1.ban[target] = true;
            global.database.ban[target] = true;

            fs.writeFileSync(filePath, JSON.stringify(database1, null, 2));

            return conn.sendMessage(
                m.chat,
                {
                    text: `✅ تم حظر المستخدم @${target.split('@')[0]}`,
                    mentions: [target]
                },
                { quoted: m }
            );
        }

    } catch (e) {
        console.log("ERROR:", e);
        m.reply("❌ حصل خطأ في الكود");
    }
};

ff.command = ['حظر', 'فك']; // مهم جدا
ff.category = 'owner';
ff.owner = true;

export default ff;
