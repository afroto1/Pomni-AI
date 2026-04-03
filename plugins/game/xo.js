let games = {};

const drawBoard = (game) => {
    const { board, size } = game;

    let out = '';

    for (let i = 0; i < board.length; i += size) {
        let row = board.slice(i, i + size).map((c, idx) => {
            if (c === 'X') return '❌';
            if (c === 'O') return '⭕';

            let num = (i + idx + 1).toString();

            // 🎯 محاذاة الأعمدة
            return num.length === 1 ? ` ${num} ` : `${num} `;
        });

        out += row.join('|') + '\n';
    }

    return out;
};

const createGame = (chatId, size = 3) => {
    games[chatId] = {
        board: Array(size * size).fill(null),
        turn: 'X',
        size,
        players: []
    };
};

const joinGame = (chatId, user) => {
    let game = games[chatId];
    if (!game) return;

    if (game.players.length >= 2) return 'اللعبة ممتلئة';

    if (!game.players.includes(user)) {
        game.players.push(user);
    }

    return `تم انضمام @${user}`;
};

const playMove = (chatId, index, symbol) => {
    let game = games[chatId];
    if (!game) return;

    if (!game.board[index]) {
        game.board[index] = symbol;
    }
};

const checkWinner = (board, size) => {
    const lines = [];

    // صفوف
    for (let i = 0; i < size; i++) {
        lines.push(board.slice(i * size, i * size + size));
    }

    // أعمدة
    for (let i = 0; i < size; i++) {
        let col = [];
        for (let j = 0; j < size; j++) {
            col.push(board[i + j * size]);
        }
        lines.push(col);
    }

    // قطر رئيسي
    let diag1 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(board[i * (size + 1)]);
    }
    lines.push(diag1);

    // قطر ثانوي
    let diag2 = [];
    for (let i = 1; i <= size; i++) {
        diag2.push(board[i * (size - 1)]);
    }
    lines.push(diag2);

    for (let line of lines) {
        if (line.every(cell => cell && cell === line[0])) {
            return line[0];
        }
    }

    return null;
};

// ===== مثال تشغيل =====

const chatId = "test";

// إنشاء لعبة 4x4
createGame(chatId, 4);

// انضمام لاعبين
console.log(joinGame(chatId, "player1"));
console.log(joinGame(chatId, "player2"));

// لعب بعض الحركات
playMove(chatId, 0, 'X');
playMove(chatId, 1, 'X');
playMove(chatId, 2, 'X');
playMove(chatId, 3, 'X');

// عرض اللوحة
console.log(drawBoard(games[chatId]));

// التحقق من الفائز
const winner = checkWinner(games[chatId].board, 4);
if (winner) {
    console.log("🏆 الفائز هو:", winner);
}
