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

    // 🤝 الانضمام للعبة
    if (isJoin) {
        if (!game) return m.reply("❌ لا توجد لعبة للانضمام! اكتب *.xo* لإنشاء لعبة.");
        if (game.status === 'playing') return m.reply("❌ اللعبة بدأت بالفعل!");
        if (game.player1 === m.sender) return m.reply("❌ لا يمكنك اللعب ضد نفسك!");
        if (game.player2) return m.reply("❌ يوجد لاعب بالفعل!");

        game.player2 = m.sender;
        game.status = 'playing';

        return conn.sendMessage(m.chat, { 
            text: `🎮 بدأت اللعبة!\n\n${drawBoard(game.board)}\n\n@${game.player1.split('@')[0]} (❌) ضد @${game.player2.split('@')[0]} (⭕)\n\n@${game.player1.split('@')[0]} يبدأ! اختر رقم من 1 إلى 9`,
            mentions: [game.player1, game.player2] 
        });
    }

    // ⚠️ لو في لعبة شغالة أو انتظار
    if (game) {
        return m.reply(
            game.status === 'waiting'
                ? `❌ @${game.player1.split('@')[0]} ينتظر خصماً.\n\nاكتب *.xo join* للانضمام أو *.xo delete* للإلغاء!`
                : "❌ توجد لعبة نشطة في هذه الدردشة!\n\nاكتب *.xo delete* لإلغاء اللعبة الحالية.",
            null,
            game.status === 'waiting' ? { mentions: [game.player1] } : undefined
        );
    }

    // 🎮 إنشاء لعبة جديدة
    global.xoGames[m.chat] = {
        player1: m.sender,
        player2: null,
        board: Array(9).fill(null),
        turn: 'X',
        status: 'waiting'
    };

    return m.reply(
        `🎮 تم إنشاء لعبة XO!\n\n@${m.sender.split('@')[0]} ينتظر خصماً.\n\nاكتب *.xo join* للانضمام!`,
        null,
        { mentions: [m.sender] }
    );
}

// 🎯 نظام اللعب
handler.before = async (m, { conn }) => {
    if (!m.text || !global.xoGames?.[m.chat]) return false;

    const game = global.xoGames[m.chat];
    if (game.status !== 'playing') return false;

    const currentPlayer = game.turn === 'X' ? game.player1 : game.player2;
    if (m.sender !== currentPlayer) return false;

    const move = parseInt(m.text.trim()) - 1;
    if (move < 0 || move > 8 || isNaN(move)) return false;

    if (game.board[move] !== null) {
        await m.reply("❌ هذا المربع مشغول بالفعل!");
        return true;
    }

    game.board[move] = game.turn;
    const winner = checkWinner(game.board);

    // 🏆 نهاية اللعبة
    if (winner || game.board.every(cell => cell)) {
        const text = winner 
            ? `${drawBoard(game.board)}\n\n🎉 @${(winner === 'X' ? game.player1 : game.player2).split('@')[0]} فاز!`
            : `${drawBoard(game.board)}\n\n🤝 تعادل!`;

        await conn.sendMessage(m.chat, { 
            text,
            mentions: winner ? [winner === 'X' ? game.player1 : game.player2] : undefined
        });

        delete global.xoGames[m.chat];
        return true;
    }

    // 🔄 تبديل الدور
    game.turn = game.turn === 'X' ? 'O' : 'X';
    const nextPlayer = game.turn === 'X' ? game.player1 : game.player2;

    await conn.sendMessage(m.chat, { 
        text: `${drawBoard(game.board)}\n\n@${nextPlayer.split('@')[0]} دورك! (${game.turn})`,
        mentions: [nextPlayer] 
    });

    return true;
};

handler.usage = ["اكس"];
handler.category = "games";
handler.command = ['اكس', 'xo'];
handler.usePrefix = true;

export default handler;

// 🎨 رسم اللوحة
const drawBoard = b => [0,3,6].map(i => 
    b.slice(i,i+3).map((c,idx) => c ? (c==='X'?'❌':'⭕') : `${i+idx+1}️⃣`).join(' | ')
).join('\n');

// 🧠 التحقق من الفائز
const checkWinner = b => {
    const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,c,d] of lines) {
        if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    return null;
};
