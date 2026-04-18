let adminme = async (m, { conn, isOwner, isROwner }) => {
    try {
        // للمطور فقط
        if (!isOwner && !isROwner) {
            return m.reply("❌ هذا الأمر للمطور فقط");
        }

        // التأكد أن الأمر داخل مجموعة
        if (!m.isGroup) {
            return m.reply("❌ هذا الأمر للمجموعات فقط");
        }

        let user = m.sender;

        // رفع المطور مشرف
        await conn.groupParticipantsUpdate(m.chat, [user], "promote");

        m.reply("✅ تم رفعك مشرفًا بنجاح");

    } catch (e) {
        m.reply("❌ حدث خطأ:\n" + e);
    }
};

adminme.help = ["ادمن"];
adminme.tags = ["owner"];
adminme.command = ["ادمن"];
adminme.group = true;
adminme.botAdmin = true;

export default adminme;
