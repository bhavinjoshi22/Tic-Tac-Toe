document.addEventListener('DOMContentLoaded', () => {
    let turn = 'X';
    let gameOver = false;
    let gameStarted = false; 
    let matchCount = 0;
    const scores = { X: 0, O: 0 };
    const playerNames = { X: 'Player X', O: 'Player O' };

    const cells = document.querySelectorAll('.cell');
    const player1El = document.getElementById('player1');
    const player2El = document.getElementById('player2');
    const messageEl = document.getElementById('message');
    const boardEl = document.querySelector('.board');
    const tbody = document.querySelector('#history tbody');
    const pXInput = document.getElementById('playerX');
    const pOInput = document.getElementById('playerO');
    const startBtn = document.getElementById('startGame');
    const tableWrapper = document.querySelector('.table-wrapper');
    const shareBtn = document.getElementById('shareBtn'); // Naya Share Button

    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8], 
        [0,4,8], [2,4,6]           
    ];

    function updateDisplays() {
        const xText = `${playerNames.X}: ${scores.X}`;
        const oText = `${playerNames.O}: ${scores.O}`;
        if(player1El) player1El.textContent = xText;
        if(player2El) player2El.textContent = oText;
    }

    const setMessage = (text, isActive = true) => { 
        if(messageEl) {
            messageEl.textContent = text;
            if (isActive) messageEl.classList.add('active');
            else messageEl.classList.remove('active');
        }
    };

    function recordWinner(winnerName, symbol) {
        matchCount++;
        const points = symbol === 'Draw' ? 0 : 750;
        const rank = 145; 
        const username = symbol === 'Draw' ? '@nobody' : `@player_${symbol.toLowerCase()}`;
        
        const trophyHTML = symbol !== 'Draw' ? 
            `<div class="trophy-wrap">
                <span class="trophy-icon">🏆</span>
                <span class="trophy-num">${matchCount}</span>
            </div>` : '';

        const rowHTML = `
            <tr>
                <td>${String(matchCount).padStart(2, '0')}</td>
                <td>${rank}</td>
                <td>
                    <div class="name-cell">
                        <div class="avatar">👤</div>
                        <div class="name-info">
                            <div class="p-name">${winnerName}</div>
                            <div class="p-user">${username}</div>
                        </div>
                        ${trophyHTML}
                    </div>
                </td>
                <td>${points}</td>
            </tr>
        `;
        
        if(tbody) {
            tbody.insertAdjacentHTML('beforeend', rowHTML);
            if(tableWrapper) tableWrapper.scrollTop = tableWrapper.scrollHeight;
        }
    }

    function resetBoard(clearScores = false) {
        boardEl.classList.add('fade-out');
        setTimeout(() => {
            cells.forEach(c => {
                c.textContent = '';
                c.classList.remove('x', 'o', 'win', 'placed');
            });
            
            if (clearScores) { 
                scores.X = 0; scores.O = 0; 
                matchCount = 0;
                if(tbody) tbody.innerHTML = ''; 
                updateDisplays(); 
                setMessage('Scores reset'); 
            }
            
            boardEl.classList.replace('fade-out', 'fade-in');
            setTimeout(() => boardEl.classList.remove('fade-in'), 260);
            
            gameOver = false;
            turn = 'X';
            if (gameStarted) setMessage(`${playerNames[turn]}'s turn`);
        }, 280);
    }

    function handleCellClick(e) {
        if (!gameStarted) {
            setMessage("Pehle naam dalkar 'Start Game' pe click karein! ⚠️");
            document.getElementById('player-setup').style.transform = 'scale(1.05)';
            setTimeout(() => document.getElementById('player-setup').style.transform = 'scale(1)', 200);
            pXInput.focus(); 
            return;
        }

        const cell = e.currentTarget;
        if (gameOver || cell.textContent.trim() !== '') return;

        cell.textContent = turn;
        cell.classList.add(turn.toLowerCase(), 'placed');

        const winCombo = winningCombos.find(combo => combo.every(i => cells[i].textContent === turn));
        
        if (winCombo) {
            gameOver = true;
            winCombo.forEach(i => cells[i].classList.add('win'));
            scores[turn]++;
            updateDisplays();
            recordWinner(playerNames[turn], turn);
            
            setMessage(`${playerNames[turn]} wins! 🎉`);
            setTimeout(() => resetBoard(false), 2000); 
            return;
        }

        if (Array.from(cells).every(c => c.textContent.trim() !== '')) {
            gameOver = true;
            recordWinner('Draw', 'Draw');
            setMessage(`It's a draw! 😅`);
            setTimeout(() => resetBoard(false), 2000);
            return;
        }

        turn = turn === 'X' ? 'O' : 'X';
        setMessage(`${playerNames[turn]}'s turn`);
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    const validateStart = () => {
        if(startBtn) startBtn.disabled = !(pXInput.value.trim() && pOInput.value.trim());
    };
    if(pXInput) pXInput.addEventListener('input', validateStart);
    if(pOInput) pOInput.addEventListener('input', validateStart);

    if(startBtn) {
        startBtn.addEventListener('click', () => {
            playerNames.X = pXInput.value.trim() || 'Player X';
            playerNames.O = pOInput.value.trim() || 'Player O';
            gameStarted = true; 
            updateDisplays();
            document.getElementById('player-setup').style.display = 'none';
            setMessage(`${playerNames[turn]}'s turn`);
        });
    }

    const resetBtn = document.getElementById('resetBtn');
    if(resetBtn) resetBtn.addEventListener('click', () => {
        if(gameStarted) resetBoard(false);
    });
    
    const resetScoresBtn = document.getElementById('resetScoresBtn');
    if(resetScoresBtn) resetScoresBtn.addEventListener('click', () => {
        if(gameStarted) resetBoard(true);
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            document.body.classList.toggle('dark');
            e.target.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
        });
    }

    // Naya Share Button Event Listener
    if(shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Tic-Tac-Toe Pro',
                text: 'Bhavin ka Tic-Tac-Toe game check kar aur aaja khelne! 🔥',
                url: window.location.href
            };
            
            // Agar phone hai toh native share khulega
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Share error:', err);
                }
            } else {
                // PC hai toh link copy hoga
                navigator.clipboard.writeText(window.location.href);
                setMessage('Game link copied! Paste anywhere. 📋');
                setTimeout(() => setMessage(`${playerNames[turn]}'s turn`), 2000);
            }
        });
    }

    updateDisplays();
    setMessage(`Enter names to start!`, false);
});
