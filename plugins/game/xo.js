async function handler(m, { command, text, conn }) {
    global.xoGames ??= {};
    const game = global.xoGames[m.chat];

    const args = text.trim().toLowerCase().split(' ');
    const cmd = args[0];

    const isDelete = cmd === 'delete' || cmd === 'حذف';
    const isJoin = cmd === 'join' || cmd === 'انضمام';

    // 🗑️ حذف اللعبة
    if (isDelete) {
        if (!game) return m.reply("❌ لا توجد لعبة نشطة للحذف!");
        if (game.player1 !== m.sender && game.player2 !== m.sender) return m.reply("❌ فقط اللاعبين يمكنهم حذف اللعبة!");
        delete global.xoGames[m.chat];
        return m.reply("🗑️ تم حذف اللعبة!");
    }

    // 🤝 الانضمام
    if (isJoin) {
        if (!game) return m.reply("❌ لا توجد لعبة!");
        if (game.status === 'playing') return m.reply("❌ بدأت!");
        if (game.player1 === m.sender) return m.reply("❌ لا تلعب ضد نفسك!");
        if (game.player2) return m.reply("❌ يوجد لاعب!");

        game.player2 = m.sender;
        game.status = 'playing';

        return conn.sendMessage(m.chat, { 
            text: `🎮 بدأت اللعبة!\n\n${drawBoard(game)}\n\n@${game.player1.split('@')[0]} (❌) ضد @${game.player2.split('@')[0]} (⭕)\n\n@${game.player1.split('@')[0]} يبدأ!`,
            mentions: [game.player1, game.player2] 
        });
    }

    if (game) {
        return m.reply(
            game.status === 'waiting'
                ? `❌ @${game.player1.split('@')[0]} ينتظر لاعب`
                : "❌ توجد لعبة شغالة",
            null,
            game.status === 'waiting' ? { mentions: [game.player1] } : undefined
        );
    }

    // 🎮 إنشاء لعبة
    global.xoGames[m.chat] = {
        player1: m.sender,
        player2: null,
        board: Array(9).fill(null),
        size: 3, // 🧠 حجم اللوحة
        turn: 'X',
        status: 'waiting'
    };

    return m.reply(`🎮 تم إنشاء لعبة XO\nاكتب *.xo join*`);
}

// 🎯 اللعب
handler.before = async (m, { conn }) => {
    if (!m.text || !global.xoGames?.[m.chat]) return false;

    const game = global.xoGames[m.chat];
    if (game.status !== 'playing') return false;

    const currentPlayer = game.turn === 'X' ? game.player1 : game.player2;
    if (m.sender !== currentPlayer) return false;

    const move = parseInt(m.text.trim()) - 1;
    if (isNaN(move) || move < 0 || move >= game.board.length) return false;

    if (game.board[move] !== null) {
        await m.reply("❌ محجوز");
        return true;
    }

    game.board[move] = game.turn;
    const winner = checkWinner(game);

    // 🏆 نهاية
    if (winner || game.board.every(x => x)) {

        // 🧠 حالة التعادل → مستوى أصعب
        if (!winner && game.size === 3) {
            game.size = 4;
            game.board = Array(16).fill(null);
            game.turn = 'X';

            return conn.sendMessage(m.chat, {
                text: `🤝 تعادل!\n🔥 تم الانتقال إلى مستوى أصعب (4x4)\n\n${drawBoard(game)}\n\n@${game.player1.split('@')[0]} يبدأ!`,
                mentions: [game.player1]
            });
        }

        const text = winner
            ? `${drawBoard(game)}\n\n🎉 الفائز @${(winner === 'X' ? game.player1 : game.player2).split('@')[0]}`
            : `${drawBoard(game)}\n\n🤝 تعادل نهائي!`;

        await conn.sendMessage(m.chat, { text });

        delete global.xoGames[m.chat];
        return true;
    }

    // 🔄 تبديل
    game.turn = game.turn === 'X' ? 'O' : 'X';
    const next = game.turn === 'X' ? game.player1 : game.player2;

    await conn.sendMessage(m.chat, { 
        text: `${drawBoard(game)}\n\n@${next.split('@')[0]} دورك (${game.turn})`,
        mentions: [next] 
    });

    return true;
};

handler.command = ['xo','اكس'];
export default handler;

// 🎨 رسم اللوحة (مطور)
const drawBoard = (game) => {
    const { board, size } = game;

    let result = '';
    for (let i = 0; i < board.length; i += size) {
        let row = board.slice(i, i + size).map((c, idx) => {
            if (c === 'X') return '❌';
            if (c === 'O') return '⭕';

            // 🧠 مستوى ثاني
            if (size === 4) return `🟨${i + idx + 1}`;
            
            return `${i + idx + 1}️⃣`;
        }).join(' | ');

        result += row + '\n';
    }

    return result;
};

// 🧠 فحص الفوز (يدعم 3x3 و 4x4)
const checkWinner = (game) => {
    const { board, size } = game;

    const lines = [];

    // صفوف
    for (let i = 0; i < size; i++) {
        lines.push([...Array(size)].map((_, j) => i * size + j));
    }

    // أعمدة
    for (let i = 0; i < size; i++) {
        lines.push([...Array(size)].map((_, j) => j * size + i));
    }

    // أقطار
    lines.push([...Array(size)].map((_, i) => i * (size + 1)));
    lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1)));

    for (const line of lines) {
        const first = board[line[0]];
        if (first && line.every(i => board[i] === first)) return first;
    }

    return null;
};
