/* ==========================================================================
   Minimalist Portfolio Javascript Interactions
   Author: Chalicheemala Surya Thejas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgressBar();
    initScrollAnimations();
    initRoleCycle();
    initContactForm();
    initSnakeGame();
    initTicTacToeGame();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Theme Manager: Dark/Light Mode
 * Detects user setting, system preferences, and saves to localStorage.
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const lightLabel = document.getElementById('theme-light-label');
    const darkLabel = document.getElementById('theme-dark-label');
    
    if (!themeToggle || !lightLabel || !darkLabel) return;

    // Retrieve saved theme preference or query system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Default to dark unless light is preferred
    let currentTheme = 'dark';
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (systemPrefersLight) {
        currentTheme = 'light';
    }

    setTheme(currentTheme);

    // Click handler to toggle theme
    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(activeTheme);
        localStorage.setItem('theme', activeTheme);
    });

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            lightLabel.classList.add('theme-active');
            darkLabel.classList.remove('theme-active');
        } else {
            document.documentElement.removeAttribute('data-theme');
            darkLabel.classList.add('theme-active');
            lightLabel.classList.remove('theme-active');
        }
    }
}

/**
 * Scroll Progress Bar
 * Calculates current scroll position against maximum scrollable height and sets bar width.
 */
function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    const updateProgressBar = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollableHeight = docHeight - winHeight;

        if (scrollableHeight <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        const scrolledPercentage = (scrollY / scrollableHeight) * 100;
        progressBar.style.width = `${scrolledPercentage}%`;
    };

    // Listen to scroll and resize events
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('resize', updateProgressBar, { passive: true });
    updateProgressBar();
}

/**
 * Scroll Animations using IntersectionObserver
 * Fades elements up subtly when they come into view.
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (prefersReducedMotion) {
        fadeElements.forEach(element => element.classList.add('visible'));
        return;
    }
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px -8% 0px', // triggers slightly before entering the screen fully
            threshold: 0.05
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // stop observing once shown
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }
}

/**
 * Hero Role Cycle
 * Cross-fades through Surya's different professional roles in the hero subtitle.
 * Respects prefers-reduced-motion by displaying a single static role.
 */
function initRoleCycle() {
    const el = document.getElementById('role-cycle');
    if (!el) return;

    const roles = [
        'Data Science Engineer',
        'AI / ML Engineer',
        'Full-Stack Developer'
    ];

    if (prefersReducedMotion) {
        el.textContent = roles[0];
        return;
    }

    let index = 0;
    setInterval(() => {
        index = (index + 1) % roles.length;
        el.classList.add('role-cycle-out');

        setTimeout(() => {
            el.textContent = roles[index];
            el.classList.remove('role-cycle-out');
        }, 350);
    }, 2800);
}

/**
 * FormSubmit Contact Form Submission
 * Intercepts form submit to show beautiful UX status updates and handles submission.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    if (!form || !statusMsg) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const actionUrl = form.getAttribute('action');
        showStatus('Sending...', '');

        const data = new FormData(form);
        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showStatus('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                const responseData = await response.json();
                if (responseData && responseData.message) {
                    showStatus(responseData.message, 'error');
                } else {
                    showStatus('Oops! There was a problem submitting your form.', 'error');
                }
            }
        } catch (error) {
            showStatus('Connection error. Please try again later.', 'error');
        }
    });

    function showStatus(message, type) {
        statusMsg.textContent = message;
        statusMsg.className = 'form-status-msg visible';
        
        if (type === 'success') {
            statusMsg.classList.add('success');
            statusMsg.classList.remove('error');
        } else if (type === 'error') {
            statusMsg.classList.add('error');
            statusMsg.classList.remove('success');
        } else {
            statusMsg.classList.remove('success', 'error');
        }
    }
}

/**
 * Snake Retro Game
 * Premium modern implementation with Canvas, Audio synthesis, LocalStorage, and Mobile Touch D-pad
 */
function initSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreVal = document.getElementById('game-score');
    const highscoreVal = document.getElementById('game-highscore');
    const overlay = document.getElementById('game-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlaySubtitle = document.getElementById('overlay-subtitle');
    const playBtn = document.getElementById('game-play-btn');
    const resetBtn = document.getElementById('game-reset-btn');
    const difficultySelect = document.getElementById('game-difficulty');
    const soundToggle = document.getElementById('sound-toggle');

    // Grid details
    const gridSize = 20; // 20x20 grid
    const cellSize = canvas.width / gridSize; // 20px per cell

    // Game variables
    let snake = [];
    let food = { x: 0, y: 0 };
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highscore = parseInt(localStorage.getItem('snake_highscore')) || 0;
    let gameInterval = null;
    let gameState = 'idle'; // 'idle', 'playing', 'paused', 'gameover'
    let soundEnabled = true;
    let gameSpeed = 90; // ms per step

    // Audio Context (lazily initialized to comply with browser autoplay policies)
    let audioCtx = null;

    // Set highscore in UI
    highscoreVal.textContent = String(highscore).padStart(3, '0');

    // Sound Synthesizer using Web Audio API
    function playSound(type) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'eat') {
                // Short, rising synth chirp
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.02, now); // Quiet, subtle gain
                gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'die') {
                // Descending frequency rumble
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.linearRampToValueAtTime(40, now + 0.45);
                gain.gain.setValueAtTime(0.03, now); // Quiet, subtle gain
                gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } else if (type === 'pause' || type === 'click') {
                // Short neutral beep
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.01, now); // Quiet, subtle gain
                gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        } catch (e) {
            console.warn("Web Audio API not supported or blocked", e);
        }
    }

    // Get Active Palette Colors dynamically
    function getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            accent: style.getPropertyValue('--accent').trim() || '#5B8DEF',
            text: style.getPropertyValue('--text').trim() || '#EDEAE3',
            textMuted: style.getPropertyValue('--text-muted').trim() || '#9A968C',
            border: style.getPropertyValue('--border').trim() || '#2A2A28',
            surface: style.getPropertyValue('--surface').trim() || '#181818',
            bg: style.getPropertyValue('--bg').trim() || '#121212'
        };
    }

    // Centralized helper: (re)starts the single game loop interval at the
    // current gameSpeed. Always clears any existing interval first so there
    // is never more than one loop running at a time.
    function restartGameLoop() {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameStep, gameSpeed);
    }

    // Game Speed mapping
    function updateSpeed() {
        const diff = difficultySelect.value;
        if (diff === 'slow') gameSpeed = 130;
        else if (diff === 'normal') gameSpeed = 85;
        else if (diff === 'fast') gameSpeed = 50;

        // If playing, restart interval with new speed
        if (gameState === 'playing') {
            restartGameLoop();
        }
    }

    difficultySelect.addEventListener('change', updateSpeed);

    // Toggle Sound Button
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        const textSpan = soundToggle.querySelector('.sound-icon');
        if (textSpan) {
            textSpan.textContent = `Sound: ${soundEnabled ? 'On' : 'Off'}`;
        }
        playSound('click');
    });

    // Start / Initialize Game Parameters
    function startGame() {
        clearInterval(gameInterval); // SAFETY: clear any running interval first!
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreVal.textContent = '000';
        spawnFood();
        gameState = 'playing';

        overlay.classList.add('hidden');
        playBtn.textContent = 'PAUSE';

        playSound('click');

        // updateSpeed() reads the difficulty <select>, sets gameSpeed, and
        // (since gameState is now 'playing') starts the single game loop
        // interval via restartGameLoop(). Previously this file *also* created
        // a second interval right after calling updateSpeed(), so two game
        // loops ran concurrently and the snake moved at roughly double the
        // intended speed — that was the "huge problem" with the game.
        updateSpeed();
    }

    function pauseGame() {
        if (gameState === 'playing') {
            gameState = 'paused';
            clearInterval(gameInterval);
            overlayTitle.textContent = 'PAUSED';
            overlaySubtitle.textContent = 'Press Resume or Arrow Key to continue';
            playBtn.textContent = 'RESUME';
            overlay.classList.remove('hidden');
            playSound('pause');
        } else if (gameState === 'paused') {
            gameState = 'playing';
            overlay.classList.add('hidden');
            playBtn.textContent = 'PAUSE';
            playSound('click');
            restartGameLoop();
        }
    }

    function gameOver() {
        gameState = 'gameover';
        clearInterval(gameInterval);
        playSound('die');

        // Check highscore
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('snake_highscore', highscore);
            highscoreVal.textContent = String(highscore).padStart(3, '0');
        }

        overlayTitle.textContent = 'GAME OVER';
        overlaySubtitle.textContent = `Final Score: ${score}`;
        playBtn.textContent = 'PLAY AGAIN';
        overlay.classList.remove('hidden');
    }

    // Spawn food on coordinates not occupied by the snake
    function spawnFood() {
        // Bounded random search first (fast in the common case); falls back
        // to an exhaustive scan of free cells so we can never spin forever
        // even when the snake nearly fills the board.
        for (let attempt = 0; attempt < 100; attempt++) {
            const candidate = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
            if (!snake.some(seg => seg.x === candidate.x && seg.y === candidate.y)) {
                food.x = candidate.x;
                food.y = candidate.y;
                return;
            }
        }

        const freeCells = [];
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if (!snake.some(seg => seg.x === x && seg.y === y)) {
                    freeCells.push({ x, y });
                }
            }
        }
        if (freeCells.length > 0) {
            const pick = freeCells[Math.floor(Math.random() * freeCells.length)];
            food.x = pick.x;
            food.y = pick.y;
        }
    }

    // Main game update loop
    function gameStep() {
        direction = nextDirection;
        const head = { ...snake[0] };

        // Move head based on direction
        if (direction === 'up') head.y -= 1;
        else if (direction === 'down') head.y += 1;
        else if (direction === 'left') head.x -= 1;
        else if (direction === 'right') head.x += 1;

        // Collision Check: Boundaries or Self
        if (
            head.x < 0 || head.x >= gridSize ||
            head.y < 0 || head.y >= gridSize ||
            collisionWithSelf(head)
        ) {
            gameOver();
            return;
        }

        // Add new head segment
        snake.unshift(head);

        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreVal.textContent = String(score).padStart(3, '0');
            playSound('eat');
            spawnFood();
        } else {
            // Remove tail segment if food was not eaten
            snake.pop();
        }

        draw();
    }

    function collisionWithSelf(head) {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    // Drawing functions
    function draw() {
        const colors = getThemeColors();
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const canvasBg = isLight ? '#FAF9F6' : '#0b0b0b';
        const gridStroke = isLight ? '#E5E3DB' : '#151515';
        const eyeColor = isLight ? '#FAF9F6' : '#0b0b0b';

        // Clear canvas
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = gridStroke;
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }

        // Draw Food
        ctx.fillStyle = colors.accent;
        if (!isLight) {
            ctx.shadowColor = colors.accent;
            ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        const centerX = food.x * cellSize + cellSize / 2;
        const centerY = food.y * cellSize + cellSize / 2;
        ctx.arc(centerX, centerY, cellSize / 2.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Snake
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? colors.accent : colors.text;
            
            const padding = 1.5;
            const x = segment.x * cellSize + padding;
            const y = segment.y * cellSize + padding;
            const size = cellSize - padding * 2;

            if (isHead) {
                if (!isLight) {
                    ctx.shadowColor = colors.accent;
                    ctx.shadowBlur = 4;
                }
                ctx.fillRect(x, y, size, size);
                ctx.shadowBlur = 0;

                ctx.fillStyle = eyeColor;
                const eyeSize = 2;
                if (direction === 'up' || direction === 'down') {
                    ctx.fillRect(x + 4, y + size/2 - 1, eyeSize, eyeSize);
                    ctx.fillRect(x + size - 6, y + size/2 - 1, eyeSize, eyeSize);
                } else {
                    ctx.fillRect(x + size/2 - 1, y + 4, eyeSize, eyeSize);
                    ctx.fillRect(x + size/2 - 1, y + size - 6, eyeSize, eyeSize);
                }
            } else {
                ctx.fillRect(x, y, size, size);
            }
        });
    }

    // Keyboard controls
    function handleKeyDown(e) {
        // Do not intercept keystrokes if the user is typing in form fields
        if (e.target && ['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
            return;
        }

        if (e.repeat) return; // Prevent sound loops and repeat glitches
        const key = e.key.toLowerCase();
        
        // Spacebar toggles pause/resume if game is playing or paused
        if (key === ' ' || key === 'spacebar') {
            if (gameState === 'playing' || gameState === 'paused') {
                e.preventDefault();
                pauseGame();
            }
            return;
        }

        // Only allow movement keys when actively playing (prevents starting game via scrolling)
        if (gameState !== 'playing') {
            return;
        }

        // Prevent default browser scrolling when actively playing
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
            e.preventDefault();
        }

        if ((key === 'arrowup' || key === 'w') && direction !== 'down') {
            nextDirection = 'up';
        } else if ((key === 'arrowdown' || key === 's') && direction !== 'up') {
            nextDirection = 'down';
        } else if ((key === 'arrowleft' || key === 'a') && direction !== 'right') {
            nextDirection = 'left';
        } else if ((key === 'arrowright' || key === 'd') && direction !== 'left') {
            nextDirection = 'right';
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Mobile D-pad listeners
    function setDirection(dir) {
        if (gameState === 'idle' || gameState === 'gameover') {
            startGame();
            return;
        } else if (gameState === 'paused') {
            pauseGame();
            return;
        }

        if (dir === 'up' && direction !== 'down') nextDirection = 'up';
        if (dir === 'down' && direction !== 'up') nextDirection = 'down';
        if (dir === 'left' && direction !== 'right') nextDirection = 'left';
        if (dir === 'right' && direction !== 'left') nextDirection = 'right';
    }

    document.getElementById('dpad-up').addEventListener('click', () => setDirection('up'));
    document.getElementById('dpad-down').addEventListener('click', () => setDirection('down'));
    document.getElementById('dpad-left').addEventListener('click', () => setDirection('left'));
    document.getElementById('dpad-right').addEventListener('click', () => setDirection('right'));

    // Play / Pause Overlay Button
    playBtn.addEventListener('click', () => {
        if (gameState === 'idle' || gameState === 'gameover') {
            startGame();
        } else {
            pauseGame();
        }
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        clearInterval(gameInterval);
        gameState = 'idle';
        overlayTitle.textContent = 'SNAKE ARCADE';
        overlaySubtitle.textContent = 'Press Play or Arrow Key to Start';
        playBtn.textContent = 'PLAY';
        overlay.classList.remove('hidden');
        score = 0;
        scoreVal.textContent = '000';
        playSound('click');
        draw();
    });

    // Initial paint
    draw();

    // Redraw if theme changes
    const observer = new MutationObserver(() => {
        draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/**
 * Tic-Tac-Toe Game
 * Premium neon retro board with smart AI (Vs CPU) and Local 2P modes.
 */
function initTicTacToeGame() {
    const canvas = document.getElementById('ttt-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreXVal = document.getElementById('ttt-score-x');
    const scoreOVal = document.getElementById('ttt-score-o');
    const scoreTiesVal = document.getElementById('ttt-score-ties');
    const overlay = document.getElementById('ttt-overlay');
    const overlayTitle = document.getElementById('ttt-overlay-title');
    const overlaySubtitle = document.getElementById('ttt-overlay-subtitle');
    const playBtn = document.getElementById('ttt-play-btn');
    const resetBtn = document.getElementById('ttt-reset-btn');
    const modeSelect = document.getElementById('ttt-mode');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameState = 'idle'; // 'idle', 'playing', 'gameover'
    let scores = { X: 0, O: 0, ties: 0 };

    // Get Active Palette Colors dynamically
    function getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            accent: style.getPropertyValue('--accent').trim() || '#5B8DEF',
            text: style.getPropertyValue('--text').trim() || '#EDEAE3',
            textMuted: style.getPropertyValue('--text-muted').trim() || '#9A968C',
            border: style.getPropertyValue('--border').trim() || '#2A2A28',
            surface: style.getPropertyValue('--surface').trim() || '#181818',
            bg: style.getPropertyValue('--bg').trim() || '#121212'
        };
    }

    // Draw the board
    function drawBoard() {
        const colors = getThemeColors();
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const canvasBg = isLight ? '#FAF9F6' : '#0b0b0b';
        const gridStroke = isLight ? colors.border : '#2A2A28';

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = gridStroke;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';

        const size = canvas.width;
        const cellSize = size / 3;

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(cellSize, 20);
        ctx.lineTo(cellSize, size - 20);
        ctx.moveTo(cellSize * 2, 20);
        ctx.lineTo(cellSize * 2, size - 20);
        
        // Horizontal lines
        ctx.moveTo(20, cellSize);
        ctx.lineTo(size - 20, cellSize);
        ctx.moveTo(20, cellSize * 2);
        ctx.lineTo(size - 20, cellSize * 2);
        ctx.stroke();

        // Draw moves
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = col * cellSize + cellSize / 2;
            const y = row * cellSize + cellSize / 2;

            if (board[i] === 'X') {
                drawX(x, y, cellSize / 3.5, colors.accent, isLight);
            } else if (board[i] === 'O') {
                drawO(x, y, cellSize / 3.5, colors.text, isLight);
            }
        }
    }

    function drawX(x, y, size, color, isLight) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        if (!isLight) {
            // Neon glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
        } else {
            // Soft shadow for depth in light mode
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        }

        ctx.beginPath();
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.moveTo(x + size, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    function drawO(x, y, size, color, isLight) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        if (!isLight) {
            // Neon glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
        } else {
            // Soft shadow for depth in light mode
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    function startGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameState = 'playing';
        overlay.classList.add('hidden');
        drawBoard();
    }

    // Reset board and go back to overlay
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameState = 'idle';
        overlayTitle.textContent = 'NEON XO';
        overlaySubtitle.textContent = 'Select mode and click Play';
        playBtn.textContent = 'PLAY';
        overlay.classList.remove('hidden');
        drawBoard();
    }

    function checkWinner(b) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            if (b[pattern[0]] && b[pattern[0]] === b[pattern[1]] && b[pattern[0]] === b[pattern[2]]) {
                return b[pattern[0]];
            }
        }

        if (b.every(cell => cell !== '')) {
            return 'tie';
        }

        return null;
    }

    function handleMove(index) {
        if (board[index] !== '' || gameState !== 'playing') return;

        board[index] = currentPlayer;
        drawBoard();

        const winner = checkWinner(board);
        if (winner) {
            endGame(winner);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (modeSelect.value === 'ai' && currentPlayer === 'O') {
            setTimeout(makeAiMove, 400); // realistic CPU delay
        }
    }

    function makeAiMove() {
        if (gameState !== 'playing') return;

        // 1. Win if possible
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                let tempBoard = [...board];
                tempBoard[i] = 'O';
                if (checkWinner(tempBoard) === 'O') {
                    handleMove(i);
                    return;
                }
            }
        }

        // 2. Block if opponent can win
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                let tempBoard = [...board];
                tempBoard[i] = 'X';
                if (checkWinner(tempBoard) === 'X') {
                    handleMove(i);
                    return;
                }
            }
        }

        // 3. Take center
        if (board[4] === '') {
            handleMove(4);
            return;
        }

        // 4. Take corners
        const corners = [0, 2, 6, 8];
        const freeCorners = corners.filter(i => board[i] === '');
        if (freeCorners.length > 0) {
            const randomCorner = freeCorners[Math.floor(Math.random() * freeCorners.length)];
            handleMove(randomCorner);
            return;
        }

        // 5. Take random remaining
        const freeCells = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') freeCells.push(i);
        }
        if (freeCells.length > 0) {
            const randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
            handleMove(randomCell);
        }
    }

    function endGame(winner) {
        gameState = 'gameover';
        
        if (winner === 'X') {
            scores.X++;
            scoreXVal.textContent = String(scores.X).padStart(3, '0');
            overlayTitle.textContent = 'PLAYER X WINS!';
            overlaySubtitle.textContent = 'Awesome job!';
        } else if (winner === 'O') {
            scores.O++;
            scoreOVal.textContent = String(scores.O).padStart(3, '0');
            overlayTitle.textContent = modeSelect.value === 'ai' ? 'CPU WINS!' : 'PLAYER O WINS!';
            overlaySubtitle.textContent = 'Better luck next time!';
        } else {
            scores.ties++;
            scoreTiesVal.textContent = String(scores.ties).padStart(3, '0');
            overlayTitle.textContent = "IT'S A TIE!";
            overlaySubtitle.textContent = 'Well played!';
        }

        playBtn.textContent = 'PLAY AGAIN';
        overlay.classList.remove('hidden');
    }

    canvas.addEventListener('click', (e) => {
        if (gameState !== 'playing') return;
        if (modeSelect.value === 'ai' && currentPlayer === 'O') return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const x = (clientX / rect.width) * canvas.width;
        const y = (clientY / rect.height) * canvas.height;

        const cellSize = canvas.width / 3;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        const index = row * 3 + col;

        if (index >= 0 && index < 9) {
            handleMove(index);
        }
    });

    playBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    modeSelect.addEventListener('change', resetGame);

    // Initial paint
    drawBoard();

    // Redraw if theme changes
    const themeObserver = new MutationObserver(() => {
        drawBoard();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
