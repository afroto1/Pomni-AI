let handler = async (m, { isOwner, isROwner, isAdmin, command }) => {
    try {
        // إنشاء قاعدة البيانات
        global.db ||= {};
        global.db.data ||= {};
        global.db.data.chats ||= {};
        global.db.data.chats[m.chat] ||= {};

        let chat = global.db.data.chats[m.chat];

        // ================= حظر فعلي لكل الأوامر =================
        // إذا الجروب محظور، يمنع أي أمر يبدأ بنقطة
        if (
            m.isGroup &&
            chat.banned &&
            m.text &&
            m.text.startsWith(".") &&
            !["فك_جروب"].includes(command) &&
            !isOwner &&
            !isROwner &&
            !isAdmin
        ) {
            await m.reply("🚫 هذه المجموعة محظورة من استخدام البوت");
            return true; // يوقف باقي الإضافات نهائياً
        }

        // ================= أمر الحظر =================
        if (command === "حظر_جروب") {
            if (!isOwner && !isROwner && !isAdmin) {
                return m.reply("❌ هذا الأمر للمطور أو المشرفين فقط");
            }

            chat.banned = true;
            return m.reply("🚫 تم حظر المجموعة فعلياً من استخدام البوت");
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
handler.before = true; // مهم جداً

export default handler;
