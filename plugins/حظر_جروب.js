let handler = async (m, { conn, participants, isOwner, isROwner, isAdmin, command }) => {
    try {
        // إنشاء قاعدة البيانات
        global.db ||= {};
        global.db.data ||= {};
        global.db.data.chats ||= {};
        global.db.data.chats[m.chat] ||= {};

        let chat = global.db.data.chats[m.chat];

        // ================= منع الأوامر فعلياً =================
        // إذا المجموعة محظورة وأي عضو عادي كتب أمر
        if (
            chat.banned &&
            !isOwner &&
            !isROwner &&
            !isAdmin &&
            command !== "فك_جروب"
        ) {
            return m.reply("🚫 هذه المجموعة محظورة من استخدام البوت");
        }

        // ================= أمر الحظر =================
        if (command === "حظر_جروب") {
            if (!isOwner && !isROwner && !isAdmin) {
                return m.reply("❌ هذا الأمر للمطور أو المشرفين فقط");
            }

            chat.banned = true;

            let sender = m.sender;

            // لو مشرف عادي يستخدم الأمر ينزل باقي المشرفين
            if (isAdmin && !isOwner && !isROwner) {
                let admins = participants
                    .filter(v => v.admin && v.id !== sender)
                    .map(v => v.id);

                if (admins.length) {
                    await conn.groupParticipantsUpdate(m.chat, admins, "demote");
                }
            }

            return m.reply("🚫 تم حظر المجموعة من استخدام البوت");
        }

        // ================= فك الحظر =================
        if (command === "فك_جروب") {
            if (!isOwner && !isROwner && !isAdmin) {
                return m.reply("❌ هذا الأمر للمطور أو المشرفين فقط");
            }

            chat.banned = false;
            return m.reply("✅ تم فك حظر المجموعة");
        }

    } catch (e) {
        m.reply("❌ خطأ:\n" + e);
    }
};

handler.help = ["حظر_جروب", "فك_جروب"];
handler.tags = ["group"];
handler.command = ["حظر_جروب", "فك_جروب"];
handler.group = true;
handler.botAdmin = true;
handler.before = true; // مهم جداً لتفعيل المنع قبل تنفيذ الأوامر

export default handler;
