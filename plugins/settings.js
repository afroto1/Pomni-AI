import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'system');
const DB_PATH = path.join(DB_DIR, 'database.json');

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

function loadDB() {
    if (existsSync(DB_PATH)) {
        try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } 
        catch { return {}; }
    }
    return {};
}

function saveDB(data) {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function handler(m, { conn, command, args }) {
    if (!global.database) global.database = loadDB();

    const db = global.database;
    const chatId = m.chat;
    const subCmd = args[0]?.toLowerCase();

    const menu = `
╭─┈─┈─┈─⟞🕸️⟝─┈─┈─┈─╮
- *.تفعيل ايقاف_الترحيب*
> *_البوت هيبطل يرحب ب الاعضاء_*

- *.تفعيل تشغيل_الترحيب*
> *_البوت يرحب ب الاعضاء_*

- *.تفعيل تشغيل_الادمن*
> *_البوت يرد على المشرفين فقط_*

- *.تفعيل ايقاف_الادمن*
> *_البوت يرد على الجميع_*

- *.تفعيل ايقاف_الخاص*
> *_البوت يكلم المطور فقط في الخاص_*

- *.تفعيل تشغيل_الخاص*
> *_البوت يكلم الجميع_*

- *.تفعيل مضاد_لينكات*
> *_حذف اي رابط + طرد العضو_*

- *.تفعيل ايقاف_مضاد_لينكات*
> *_إيقاف حذف الروابط_*
╰─┈─┈─┈─⟞🕸️⟝─┈─┈─┈─╯
`;

    if (!subCmd) return m.reply(menu);

    if (!db.settings) db.settings = {};
    if (!db.settings[chatId]) db.settings[chatId] = {};

    const actions = {

        'ايقاف_الترحيب': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].noWelcome = true;
            return '*✅ ~ تم تفعيل وضع عدم الترحيب*\n> *_البوت هيبطل يرحب ب الاعضاء_*';
        },

        'تشغيل_الترحيب': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].noWelcome = false;
            return '*✅ ~ تم تفعيل وضع الترحيب*\n> *_البوت يرحب ب الاعضاء_*';
        },

        'تشغيل_الادمن': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].adminOnly = true;
            return '*✅ ~ تم تفعيل وضع الادمن*\n> *_البوت سيتفاعل مع المشرفين فقط_*';
        },

        'ايقاف_الادمن': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].adminOnly = false;
            return '*✅ ~ تم فك وضع الادمن*\n> *_البوت سيتفاعل مع جميع الأعضاء_*';
        },

        'ايقاف_الخاص': () => {
            if (!m.isOwner) return '*❌ ~ هذا الأمر للمطور فقط*';
            db.developerPrivate = true;
            return '*✅ ~ تم تفعيل وضع الخاص للمطور*\n> *_البوت سيكلم المطور فقط في الخاص_*';
        },

        'تشغيل_الخاص': () => {
            if (!m.isOwner) return '*❌ ~ هذا الأمر للمطور فقط*';
            db.developerPrivate = false;
            return '*✅ ~ تم فك وضع الخاص للمطور*\n> *_البوت سيكلم الجميع_*';
        },

        // 🔥 مضاد الروابط
        'مضاد_لينكات': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].antiLinks = true;
            return '*✅ ~ تم تفعيل مضاد الروابط*\n> *_سيتم حذف أي رابط + طرد المرسل_*';
        },

        'ايقاف_مضاد_لينكات': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].antiLinks = false;
            return '*✅ ~ تم إيقاف مضاد الروابط*\n> *_يمكن إرسال الروابط الآن_*';
        }

    };

    const action = actions[subCmd];
    if (!action) return m.reply(menu);

    const result = action();
    if (typeof result === 'string') {
        if (result.startsWith('*❌')) return m.reply(result);

        saveDB(db);
        global.database = db;
        m.reply(result);
    }
}

handler.before = async (m, { conn }) => {
    if (!global.database) global.database = loadDB();

    const db = global.database;
    const settings = db.settings?.[m.chat] || {};

    if (settings.adminOnly && !m.isOwner && !m.isAdmin) return true;
    if (db.developerPrivate && !m.isOwner && !m.isGroup) return true;
    if (db.ban && !m.isOwner && db.ban[m.sender]) return true;

    // 🔥 مضاد الروابط (نسخة قوية)
    if (settings.antiLinks && m.isGroup && !m.isAdmin && !m.isOwner) {

        const text = (
            m.text ||
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            ''
        );

        const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|discord\.gg)/i;

        if (linkRegex.test(text)) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key });
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } catch (e) {
                console.log('ANTI LINK ERROR:', e);
            }
        }
    }
};

handler.usage = ['تفعيل'];
handler.category = 'admin';
handler.command = ['تفعيل'];

export default handler;
