document.addEventListener('DOMContentLoaded', function() {
    // Controle de abas
    const gameButtons = document.querySelectorAll('.game-btn');
    const gameContainers = document.querySelectorAll('.game-container');
    
    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove a classe active de todos os botões e containers
            gameButtons.forEach(btn => btn.classList.remove('active'));
            gameContainers.forEach(container => container.classList.remove('active'));
            
            // Adiciona a classe active ao botão clicado
            this.classList.add('active');
            
            // Mostra o container correspondente
            const gameId = this.getAttribute('data-game');
            const gameContainer = document.getElementById(gameId);
            gameContainer.classList.add('active');
            
            // Inicializa o jogo específico quando a aba é clicada
            initGame(gameId);
        });
    });
    
    // Função para inicializar cada jogo
    function initGame(gameId) {
        switch(gameId) {
            case 'snake':
                initSnakeGame();
                break;
            case 'memory':
                createMemoryBoard();
                break;
            case 'rps':
                // Não precisa de inicialização especial
                break;
            case 'tic-tac-toe':
                // Já está inicializado
                break;
            case 'simon':
                // Já tem seu próprio botão de iniciar
                break;
            case 'minesweeper':
                // Já tem seu próprio botão de iniciar
                break;
        }
    }

    // Inicializa o primeiro jogo (Jogo da Velha) por padrão
    initGame('tic-tac-toe');
    
    // ... (o resto do seu código existente para os outros jogos)

    
    // Jogo da Velha
    const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
    const resetTicTacToe = document.getElementById('reset-tic-tac-toe');
    const xScoreElement = document.getElementById('x-score');
    const oScoreElement = document.getElementById('o-score');
    
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let xScore = 0;
    let oScore = 0;
    let gameActive = true;
    
    // Cria o tabuleiro
    function createBoard() {
        ticTacToeBoard.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('board-cell');
            cellElement.setAttribute('data-index', index);
            cellElement.addEventListener('click', handleCellClick);
            ticTacToeBoard.appendChild(cellElement);
        });
    }
    
    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        
        if (board[index] !== '' || !gameActive) return;
        
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        
        if (checkWinner()) {
            if (currentPlayer === 'X') {
                xScore++;
                xScoreElement.textContent = xScore;
            } else {
                oScore++;
                oScoreElement.textContent = oScore;
            }
            gameActive = false;
            setTimeout(() => alert(`Jogador ${currentPlayer} venceu!`), 100);
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            gameActive = false;
            setTimeout(() => alert('Empate!'), 100);
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
    
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6]             // diagonais
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }
    
    resetTicTacToe.addEventListener('click', () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        createBoard();
    });
    
    createBoard();
    
    // Genius (Simon)
    const simonButtons = document.querySelectorAll('.simon-btn');
    const startSimonButton = document.getElementById('start-simon');
    const simonMessage = document.getElementById('simon-message');
    const simonRoundElement = document.getElementById('simon-round');
    
    let sequence = [];
    let playerSequence = [];
    let round = 1;
    let isPlaying = false;
    let isPlayerTurn = false;
    
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    function startGame() {
        sequence = [];
        playerSequence = [];
        round = 1;
        simonRoundElement.textContent = round;
        simonMessage.textContent = '';
        isPlaying = true;
        nextRound();
    }
    
    function nextRound() {
        isPlayerTurn = false;
        playerSequence = [];
        simonMessage.textContent = 'Observe a sequência...';
        
        // Adiciona uma nova cor à sequência
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        
        // Mostra a sequência
        let i = 0;
        const interval = setInterval(() => {
            highlightButton(sequence[i]);
            i++;
            
            if (i >= sequence.length) {
                clearInterval(interval);
                isPlayerTurn = true;
                simonMessage.textContent = 'Sua vez!';
            }
        }, 1000);
    }
    
    function highlightButton(color) {
        const button = document.querySelector(`.simon-btn.${color}`);
        button.classList.add('active');
        // Aqui você poderia adicionar um som: playSound(color);
        
        setTimeout(() => {
            button.classList.remove('active');
        }, 500);
    }
    
    simonButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isPlaying || !isPlayerTurn) return;
            
            const color = this.getAttribute('data-color');
            playerSequence.push(color);
            highlightButton(color);
            
            // Verifica se o jogador acertou a sequência
            if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                gameOver();
                return;
            }
            
            if (playerSequence.length === sequence.length) {
                round++;
                simonRoundElement.textContent = round;
                isPlayerTurn = false;
                setTimeout(nextRound, 1000);
            }
        });
    });
    
    function gameOver() {
        isPlaying = false;
        simonMessage.textContent = `Game Over! Você chegou ao round ${round}`;
        // playSound('error');
    }
    
    startSimonButton.addEventListener('click', startGame);
    
    // Campo Minado
    const minesweeperBoard = document.getElementById('minesweeper-board');
    const startMinesweeperButton = document.getElementById('start-minesweeper');
    const difficultySelect = document.getElementById('difficulty');
    const minesCountElement = document.getElementById('mines-count');
    
    let boardSize = 8;
    let minesCount = 10;
    let minesweeperCells = [];
    
    function createMinesweeperBoard() {
        minesweeperBoard.innerHTML = '';
        minesweeperBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        
        // Cria as células
        minesweeperCells = Array(boardSize * boardSize).fill(null).map((_, index) => {
            const cell = document.createElement('div');
            cell.classList.add('minesweeper-cell');
            cell.setAttribute('data-index', index);
            cell.addEventListener('click', () => revealCell(index));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(index);
            });
            minesweeperBoard.appendChild(cell);
            return {
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        });
        
        // Coloca as minas
        let minesPlaced = 0;
        while (minesPlaced < minesCount) {
            const randomIndex = Math.floor(Math.random() * minesweeperCells.length);
            if (!minesweeperCells[randomIndex].isMine) {
                minesweeperCells[randomIndex].isMine = true;
                minesPlaced++;
            }
        }
        
        // Calcula minas vizinhas
        minesweeperCells.forEach((cell, index) => {
            if (cell.isMine) return;
            
            const neighbors = getNeighbors(index);
            cell.neighborMines = neighbors.filter(i => minesweeperCells[i].isMine).length;
        });
    }
    
    function getNeighbors(index) {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        const neighbors = [];
        
        for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    neighbors.push(r * boardSize + c);
                }
            }
        }
        
        return neighbors;
    }
    
    function revealCell(index) {
        const cell = minesweeperCells[index];
        
        if (cell.isRevealed || cell.isFlagged) return;
        
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        
        if (cell.isMine) {
            cell.element.classList.add('mine');
            cell.element.textContent = '💣';
            gameOverMinesweeper();
            return;
        }
        
        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
            // Aqui você poderia adicionar cores diferentes para números diferentes
        } else {
            // Revela células vizinhas se não houver minas próximas
            const neighbors = getNeighbors(index);
            neighbors.forEach(neighborIndex => {
                if (!minesweeperCells[neighborIndex].isRevealed) {
                    revealCell(neighborIndex);
                }
            });
        }
        
        checkWin();
    }
    
    function flagCell(index) {
        const cell = minesweeperCells[index];
        
        if (cell.isRevealed) return;
        
        cell.isFlagged = !cell.isFlagged;
        cell.element.textContent = cell.isFlagged ? '🚩' : '';
    }
    
    function gameOverMinesweeper() {
        // Revela todas as minas
        minesweeperCells.forEach((cell, index) => {
            if (cell.isMine) {
                cell.isRevealed = true;
                cell.element.classList.add('mine');
                cell.element.textContent = '💣';
            }
        });
        
        setTimeout(() => alert('Game Over! Você clicou em uma mina.'), 100);
    }
    
    function checkWin() {
        const unrevealedSafeCells = minesweeperCells.filter(
            cell => !cell.isRevealed && !cell.isMine
        );
        
        if (unrevealedSafeCells.length === 0) {
            setTimeout(() => alert('Parabéns! Você venceu!'), 100);
        }
    }
    
    function setupMinesweeper() {
        const difficulty = difficultySelect.value;
        
        switch (difficulty) {
            case 'easy':
                boardSize = 8;
                minesCount = 10;
                break;
            case 'medium':
                boardSize = 12;
                minesCount = 20;
                break;
            case 'hard':
                boardSize = 16;
                minesCount = 40;
                break;
        }
        
        minesCountElement.textContent = minesCount;
        createMinesweeperBoard();
    }
    
    startMinesweeperButton.addEventListener('click', setupMinesweeper);
    difficultySelect.addEventListener('change', setupMinesweeper);
    
    // Inicializa com o campo minado fácil
    setupMinesweeper();


    // Substitua o código existente do jogo da cobrinha por este:

    function initSnakeGame() {
        const snakeCanvas = document.getElementById('snake-canvas');
        const ctx = snakeCanvas.getContext('2d');
        const snakeScoreElement = document.getElementById('snake-score');
        const snakeMessage = document.getElementById('snake-message');
        const startSnakeButton = document.getElementById('start-snake');
        
        // Variáveis do jogo
        let snake = [];
        let food = {};
        let direction = 'right';
        let nextDirection = 'right';
        let gameInterval;
        let score = 0;
        let gridSize = 20;
        let gameSpeed = 150;
        
        function initSnake() {
            snake = [
                {x: 5, y: 10},
                {x: 4, y: 10},
                {x: 3, y: 10}
            ];
            generateFood();
            direction = 'right';
            nextDirection = 'right';
            score = 0;
            snakeScoreElement.textContent = score;
            snakeMessage.textContent = '';
        }
        
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * (snakeCanvas.width / gridSize)),
                y: Math.floor(Math.random() * (snakeCanvas.height / gridSize))
            };
            
            // Garante que a comida não aparece em cima da cobra
            while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                food = {
                    x: Math.floor(Math.random() * (snakeCanvas.width / gridSize)),
                    y: Math.floor(Math.random() * (snakeCanvas.height / gridSize))
                };
            }
        }
        
        function drawWalls() {
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        }
        
        function drawSnake() {
            ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
            drawWalls();
            
            // Desenha a comida
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
            
            // Desenha a cobra
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
                ctx.strokeStyle = '#ecf0f1';
                ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            });
        }
        
        function moveSnake() {
            direction = nextDirection;
            const head = {...snake[0]};
            
            switch(direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }
            
            // Verifica colisões
            if (head.x < 0 || head.x >= snakeCanvas.width / gridSize ||
                head.y < 0 || head.y >= snakeCanvas.height / gridSize ||
                snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOverSnake();
                return;
            }
            
            snake.unshift(head);
            
            if (head.x === food.x && head.y === food.y) {
                score++;
                snakeScoreElement.textContent = score;
                if (score % 5 === 0 && gameSpeed > 50) {
                    gameSpeed -= 10;
                    clearInterval(gameInterval);
                    gameInterval = setInterval(moveSnake, gameSpeed);
                }
                generateFood();
            } else {
                snake.pop();
            }
            
            drawSnake();
        }
        
        function gameOverSnake() {
            clearInterval(gameInterval);
            snakeMessage.textContent = 'Game Over! Sua pontuação: ' + score;
        }
        
        // Controles por teclado
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': case 'arrowup': 
                    if (direction !== 'down') nextDirection = 'up'; break;
                case 's': case 'arrowdown': 
                    if (direction !== 'up') nextDirection = 'down'; break;
                case 'a': case 'arrowleft': 
                    if (direction !== 'right') nextDirection = 'left'; break;
                case 'd': case 'arrowright': 
                    if (direction !== 'left') nextDirection = 'right'; break;
            }
        });
        
        startSnakeButton.addEventListener('click', () => {
            initSnake();
            drawSnake();
            clearInterval(gameInterval);
            gameSpeed = 150;
            gameInterval = setInterval(moveSnake, gameSpeed);
        });
        
        // Inicializa o canvas
        initSnake();
        drawSnake();
    }

    

            // Jogo da Memória
            // Jogo da Memória
        const memoryBoard = document.getElementById('memory-board');
        const startMemoryButton = document.getElementById('start-memory');
        const movesCountElement = document.getElementById('moves-count');
        const memoryMessage = document.getElementById('memory-message');

        let cards = [];
        let flippedCards = [];
        let moves = 0;
        let matchedPairs = 0;
        const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

        function createMemoryBoard() {
            memoryBoard.innerHTML = '';
            moves = 0;
            matchedPairs = 0;
            movesCountElement.textContent = moves;
            memoryMessage.textContent = '';
            flippedCards = [];
            
            // Duplica e embaralha os símbolos
            cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            
            // Cria as cartas
            cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.classList.add('memory-card');
                card.setAttribute('data-index', index);
                card.setAttribute('data-symbol', symbol);
                card.addEventListener('click', flipCard);
                
                // Adiciona frente e verso da carta
                const cardInner = document.createElement('div');
                cardInner.classList.add('card-inner');
                cardInner.textContent = symbol;
                card.appendChild(cardInner);
                
                memoryBoard.appendChild(card);
            });
        }

        function flipCard() {
            // Não faz nada se já tiver 2 cartas viradas ou se a carta já estiver virada
            if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
                return;
            }
            
            // Vira a carta
            this.classList.add('flipped');
            flippedCards.push(this);
            
            // Quando duas cartas estiverem viradas, verifica se combinam
            if (flippedCards.length === 2) {
                moves++;
                movesCountElement.textContent = moves;
                setTimeout(checkMatch, 500);
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const symbol1 = card1.getAttribute('data-symbol');
            const symbol2 = card2.getAttribute('data-symbol');
            
            if (symbol1 === symbol2) {
                // Cartas combinam
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                
                if (matchedPairs === symbols.length) {
                    memoryMessage.textContent = `Você venceu em ${moves} movimentos!`;
                }
            } else {
                // Cartas não combinam - vira de volta
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            flippedCards = [];
        }

        // Inicializa o jogo quando a aba é clicada
        document.querySelector('.game-btn[data-game="memory"]').addEventListener('click', function() {
            createMemoryBoard();
        });

        // Botão para reiniciar o jogo
        startMemoryButton.addEventListener('click', createMemoryBoard);

    // Pedra, Papel e Tesoura
    const rpsButtons = document.querySelectorAll('.rps-btn');
    const playerScoreElement = document.getElementById('player-score');
    const cpuScoreElement = document.getElementById('cpu-score');
    const playerChoiceElement = document.getElementById('player-choice');
    const cpuChoiceElement = document.getElementById('cpu-choice');
    const resultMessage = document.getElementById('result-message');
    const gameHistory = document.getElementById('game-history');

    let playerScore = 0;
    let cpuScore = 0;
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = {rock: '✊', paper: '✋', scissors: '✌️'};

    document.querySelector('.game-btn[data-game="rps"]').addEventListener('click', function() {
        playerChoiceElement.textContent = '';
        cpuChoiceElement.textContent = '';
        resultMessage.textContent = 'Faça sua jogada!';
    });

    function playRound(playerSelection) {
        const cpuSelection = choices[Math.floor(Math.random() * choices.length)];
        
        playerChoiceElement.textContent = emojis[playerSelection];
        cpuChoiceElement.textContent = emojis[cpuSelection];
        
        let result;
        
        if (playerSelection === cpuSelection) {
            result = 'Empate!';
        } else if (
            (playerSelection === 'rock' && cpuSelection === 'scissors') ||
            (playerSelection === 'paper' && cpuSelection === 'rock') ||
            (playerSelection === 'scissors' && cpuSelection === 'paper')
        ) {
            result = 'Você ganhou!';
            playerScore++;
        } else {
            result = 'CPU ganhou!';
            cpuScore++;
        }
        
        playerScoreElement.textContent = playerScore;
        cpuScoreElement.textContent = cpuScore;
        resultMessage.textContent = result;
        
        // Adiciona ao histórico
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = `Você: ${playerSelection} vs CPU: ${cpuSelection} - ${result}`;
        gameHistory.prepend(historyItem);
    }

    rpsButtons.forEach(button => {
        button.addEventListener('click', () => {
            playRound(button.getAttribute('data-choice'));
        });
    });
});