let handler = async (m, { conn, participants, isOwner, isROwner, isAdmin, command }) => {
    try {
        // صلاحيات الاستخدام
        if (!isOwner && !isROwner && !isAdmin) {
            return m.reply("❌ هذا الأمر للمطور أو المشرفين فقط");
        }

        // إنشاء قاعدة البيانات إذا غير موجودة
        global.db ||= {};
        global.db.data ||= {};
        global.db.data.chats ||= {};
        global.db.data.chats[m.chat] ||= {};

        // ================= حظر الجروب =================
        if (command === "حظر_جروب") {
            global.db.data.chats[m.chat].banned = true;

            let sender = m.sender;

            // إذا المنفذ مشرف فقط وليس مطور
            if (isAdmin && !isOwner && !isROwner) {
                let admins = participants
                    .filter(v => v.admin && v.id !== sender)
                    .map(v => v.id);

                if (admins.length) {
                    await conn.groupParticipantsUpdate(m.chat, admins, "demote");
                }
            }

            return m.reply("🚫 تم حظر المجموعة من استخدام البوت\n\nاكتب:\n.فك_جروب");
        }

        // ================= فك الحظر =================
        if (command === "فك_جروب") {
            global.db.data.chats[m.chat].banned = false;
            return m.reply("✅ تم فك حظر المجموعة بنجاح");
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

export default handler;
