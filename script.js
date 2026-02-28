document.addEventListener('DOMContentLoaded', () => {
    let turn = 'X', gameOver = false, gameStarted = false, matchCount = 0;
    const scores = { X: 0, O: 0 }, playerNames = { X: 'Player X', O: 'Player O' };
    const cells = document.querySelectorAll('.cell'), boardEl = document.querySelector('.board');
    const tbody = document.querySelector('#history tbody'), tableWrapper = document.querySelector('.table-wrapper');
    const pXInput = document.getElementById('playerX'), pOInput = document.getElementById('playerO'), startBtn = document.getElementById('startGame');

    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function updateDisplays() {
        document.getElementById('player1').textContent = `${playerNames.X}: ${scores.X}`;
        document.getElementById('player2').textContent = `${playerNames.O}: ${scores.O}`;
    }

    function recordWinner(winnerName, symbol) {
        matchCount++;
        const displayWinner = symbol === 'Draw' ? 'Draw 🤝' : winnerName;
        
        const rowHTML = `
            <tr>
                <td>${matchCount}</td>
                <td>
                    <div class="players-cell">
                        <span>${playerNames.X}</span>
                        <span>${playerNames.O}</span>
                    </div>
                </td>
                <td style="color: ${symbol === 'Draw' ? '#FFF' : '#f59e0b'};">
                    ${displayWinner}
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHTML);
        tableWrapper.scrollTop = tableWrapper.scrollHeight;
    }

    function resetBoard(clearScores = false) {
        boardEl.classList.add('fade-out');
        setTimeout(() => {
            cells.forEach(c => { c.textContent = ''; c.classList.remove('x','o','win','placed'); });
            if (clearScores) { scores.X = 0; scores.O = 0; matchCount = 0; tbody.innerHTML = ''; updateDisplays(); }
            boardEl.classList.replace('fade-out', 'fade-in');
            gameOver = false; turn = 'X';
        }, 280);
    }

    cells.forEach(cell => cell.addEventListener('click', (e) => {
        if (!gameStarted || gameOver || e.target.textContent !== '') return;
        e.target.textContent = turn; e.target.classList.add(turn.toLowerCase(), 'placed');
        const win = winningCombos.find(combo => combo.every(i => cells[i].textContent === turn));
        if (win) {
            gameOver = true; win.forEach(i => cells[i].classList.add('win'));
            scores[turn]++; updateDisplays(); recordWinner(playerNames[turn], turn);
            setTimeout(() => resetBoard(), 2000);
        } else if ([...cells].every(c => c.textContent !== '')) {
            gameOver = true; recordWinner('Draw', 'Draw'); setTimeout(() => resetBoard(), 2000);
        } else { turn = turn === 'X' ? 'O' : 'X'; }
    }));

    pXInput.addEventListener('input', () => startBtn.disabled = !(pXInput.value.trim() && pOInput.value.trim()));
    pOInput.addEventListener('input', () => startBtn.disabled = !(pXInput.value.trim() && pOInput.value.trim()));
    startBtn.addEventListener('click', () => {
        playerNames.X = pXInput.value; playerNames.O = pOInput.value;
        gameStarted = true; updateDisplays(); document.getElementById('player-setup').style.display = 'none';
    });
    document.getElementById('resetBtn').addEventListener('click', () => resetBoard());
    document.getElementById('resetScoresBtn').addEventListener('click', () => resetBoard(true));
    document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
});
