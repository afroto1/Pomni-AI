import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '201067999523', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false,
  owners: [
    // Owner 1
    { name: "AFROTO", lid: "121634144935975@lid", jid: "61488826998@s.whatsapp.net" },
    // Owner 2
    { name: "KING BLACK 👑", lid: "77039247822892@lid", jid: "994407941269@s.whatsapp.net" },
    // Owner 3
    { name: "كارثه بيه", jid: "212776030802@s.whatsapp.net", lid: "3775964147906@lid" },
    // Owner 4 
    { name: "عفرتو الدجال 🌚", jid: "61488826998@s.whatsapp.net", lid: "121634144935975@lid" }
  ],
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
  global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;

config.info = { 
  nameBot: "♡ 𝙋𝙊𝙉𝙈𝙄 🎪 〈", 
  nameChannel: "𝐵𝛩𝑇 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐋𝐀𝐂𝐊 🇪🇬 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️", 
  idChannel: "120363291329944922@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v"
  },
  copyright: { 
    pack: 'ڤـ ـ AFROTO ـ ـا', 
    author: 'AFROTO'
  },
  images: [
    "https://i.pinimg.com/originals/11/26/97/11269786cdb625c60213212aa66273a9.png",
    "https://i.pinimg.com/originals/e2/21/20/e221203f319df949ee65585a657501a2.jpg",
    "https://i.pinimg.com/originals/bb/77/0f/bb770fad66a634a6b3bf93e9c00bf4e5.jpg"
  ]
};

/* =========== Start ========== */
client.start();

/* =========== Load Sub System ========== */
setTimeout(async () => {
  if (client.commandSystem) { 
    sub(client);
  }
}, 2000);
