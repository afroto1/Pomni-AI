async function handler(m, { command, text, conn }) {
    global.xoGames ??= {};
    const game = global.xoGames[m.chat];

    const args = text.trim().toLowerCase().split(' ');
    const cmd = args[0];

    const isDelete = cmd === 'delete' || cmd === 'حذف';
    const isJoin = cmd === 'join' || cmd === 'انضمام';

    // 🗑️ حذف
    if (isDelete) {
        if (!game) return m.reply("❌ لا توجد لعبة!");
        if (game.player1 !== m.sender && game.player2 !== m.sender) return m.reply("❌ فقط اللاعبين!");
        delete global.xoGames[m.chat];
        return m.reply("🗑️ تم الحذف!");
    }

    // 🤝 انضمام
    if (isJoin) {
        if (!game) return m.reply("❌ لا توجد لعبة!");
        if (game.status === 'playing') return m.reply("❌ بدأت!");
        if (game.player1 === m.sender) return m.reply("❌ لا تلعب ضد نفسك!");
        if (game.player2) return m.reply("❌ يوجد لاعب!");

        game.player2 = m.sender;
        game.status = 'playing';

        return conn.sendMessage(m.chat, { 
            text: `🤝 انضم لاعب جديد!\n\n@${game.player2.split('@')[0]} دخل اللعبة\n\n${drawBoard(game)}\n\n@${game.player1.split('@')[0]} (❌) ضد @${game.player2.split('@')[0]} (⭕)\n\n@${game.player1.split('@')[0]} يبدأ!`,
            mentions: [game.player1, game.player2] 
        });
    }

    if (game) {
        return m.reply("❌ توجد لعبة شغالة");
    }

    // 🎮 إنشاء
    global.xoGames[m.chat] = {
        player1: m.sender,
        player2: null,
        board: Array(9).fill(null),
        size: 3,
        turn: 'X',
        status: 'waiting'
    };

    return conn.sendMessage(m.chat, {
        text: `🎮 تم إنشاء لعبة XO!\n\n@${m.sender.split('@')[0]} بدأ اللعبة وينتظر لاعب...\n\nاكتب *.xo join* للانضمام!`,
        mentions: [m.sender]
    });
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

        // 🔥 تعادل → مستوى ثاني (5x5)
        if (!winner && game.size === 3) {
            game.size = 5;
            game.board = Array(25).fill(null);
            game.turn = 'X';

            return conn.sendMessage(m.chat, {
                text: `🤝 تعادل!\n🎯 مستوى أصعب (5x5)\n🎯 الفوز = 4 متتالية\n\n${drawBoard(game)}\n\n@${game.player1.split('@')[0]} ضد @${game.player2.split('@')[0]}\n\n@${game.player1.split('@')[0]} يبدأ!`,
                mentions: [game.player1, game.player2]
            });
        }

        const text = winner
            ? `${drawBoard(game)}\n\n🎉 الفائز @${(winner === 'X' ? game.player1 : game.player2).split('@')[0]}`
            : `${drawBoard(game)}\n\n🤝 تعادل نهائي!`;

        await conn.sendMessage(m.chat, { text });

        delete global.xoGames[m.chat];
        return true;
    }

    game.turn = game.turn === 'X' ? 'O' : 'X';
    const next = game.turn === 'X' ? game.player1 : game.player2;

    await conn.sendMessage(m.chat, { 
        text: `${drawBoard(game)}\n\n@${next.split('@')[0]} دورك (${game.turn})`,
        mentions: [next] 
    });

    return true;
};

// 👇 الإضافة فقط
handler.category = 'games'
handler.usage = ['xo','اكس']

handler.command = ['xo','اكس'];
export default handler;