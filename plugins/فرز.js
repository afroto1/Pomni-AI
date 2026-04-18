let farz = async (m, { conn, participants, isAdmin, isOwner, isROwner }) => {
    try {
        // السماح للمشرف أو المطور فقط
        if (!isAdmin && !isOwner && !isROwner) {
            return m.reply("❌ هذا الأمر للمشرفين أو المطور فقط");
        }

        let botId = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        let myId = m.sender;

        // يطرد الجميع ماعدا أنت والبوت
        let targets = participants
            .filter(user =>
                user.id !== myId &&
                user.id !== botId
            )
            .map(user => user.id);

        if (!targets.length) {
            return m.reply("❌ لا يوجد أعضاء للطرد");
        }

        await m.reply(`⚠️ جاري طرد ${targets.length} عضو دفعة واحدة...`);

        // طرد الجميع مرة واحدة
        await conn.groupParticipantsUpdate(m.chat, targets, "remove");

        m.reply("✅ تم طرد الجميع وبقيت أنت فقط");

    } catch (e) {
        m.reply("❌ حدث خطأ:\n" + e);
    }
};

farz.help = ["فرز"];
farz.tags = ["group"];
farz.command = ["فرز"];
farz.group = true;
farz.botAdmin = true;

export default farz;