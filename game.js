const gameState = {
    words: [
        { english: "hello", chinese: "你好" },
        { english: "world", chinese: "世界" },
        { english: "computer", chinese: "电脑" },
        { english: "book", chinese: "书" },
        { english: "student", chinese: "学生" },
        { english: "teacher", chinese: "老师" },
        { english: "school", chinese: "学校" },
        { english: "friend", chinese: "朋友" }
    ],
    selectedWord: null,
    matchedPairs: [],
    score: 0,
    timeLeft: 90,
    timer: null,
    isPlaying: false,
    soundEnabled: true
};

const elements = {
    englishWords: document.getElementById('englishWords'),
    chineseWords: document.getElementById('chineseWords'),
    canvas: document.getElementById('connectionCanvas'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    remaining: document.getElementById('remaining'),
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartBtn'),
    soundBtn: document.getElementById('soundBtn'),
    successSound: document.getElementById('successSound'),
    errorSound: document.getElementById('errorSound')
};

// 初始化游戏
function initGame() {
    setupCanvas();
    renderWords();
    updateUI();
    setupEventListeners();
}

// 设置画布
function setupCanvas() {
    const canvas = elements.canvas;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

// 渲染单词卡片
function renderWords() {
    elements.englishWords.innerHTML = '';
    elements.chineseWords.innerHTML = '';

    const shuffledWords = [...gameState.words];
    shuffleArray(shuffledWords);

    shuffledWords.forEach(word => {
        const englishCard = createWordCard(word.english, 'english');
        const chineseCard = createWordCard(word.chinese, 'chinese');
        
        elements.englishWords.appendChild(englishCard);
        elements.chineseWords.appendChild(chineseCard);
    });
}

// 创建单词卡片
function createWordCard(text, type) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = text;
    card.dataset.type = type;
    card.dataset.word = text;
    
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}

// 处理卡片点击
function handleCardClick(card) {
    if (!gameState.isPlaying || card.classList.contains('matched')) return;

    if (gameState.selectedWord) {
        checkMatch(card);
    } else {
        selectCard(card);
    }
}

// 选择卡片
function selectCard(card) {
    gameState.selectedWord = card;
    card.classList.add('selected');
}

// 检查匹配
function checkMatch(card) {
    const firstCard = gameState.selectedWord;
    const secondCard = card;

    if (firstCard === secondCard) return;

    const isMatch = checkWordMatch(firstCard, secondCard);
    if (isMatch) {
        handleMatch(firstCard, secondCard);
    } else {
        handleMismatch(firstCard, secondCard);
    }

    gameState.selectedWord = null;
    firstCard.classList.remove('selected');
}

// 检查单词匹配
function checkWordMatch(card1, card2) {
    if (card1.dataset.type === card2.dataset.type) return false;
    
    const word1 = gameState.words.find(w => 
        w[card1.dataset.type] === card1.dataset.word);
    const word2 = gameState.words.find(w => 
        w[card2.dataset.type] === card2.dataset.word);
    
    return word1 === word2;
}

// 处理匹配成功
function handleMatch(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    gameState.matchedPairs.push([card1, card2]);
    gameState.score += 10;
    
    if (gameState.soundEnabled) {
        elements.successSound.play().catch(() => {});
    }
    
    updateUI();
    checkGameWin();
}

// 处理匹配失败
function handleMismatch(card1, card2) {
    card1.classList.add('error');
    card2.classList.add('error');
    
    if (gameState.soundEnabled) {
        elements.errorSound.play().catch(() => {});
    }

    setTimeout(() => {
        card1.classList.remove('error');
        card2.classList.remove('error');
    }, 1000);
}

// 检查游戏胜利
function checkGameWin() {
    if (gameState.matchedPairs.length === gameState.words.length) {
        endGame(true);
    }
}

// 开始游戏
function startGame() {
    gameState.isPlaying = true;
    gameState.timeLeft = 90;
    startTimer();
    elements.startBtn.disabled = true;
}

// 开始计时器
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        elements.timer.textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// 结束游戏
function endGame(isWin) {
    clearInterval(gameState.timer);
    gameState.isPlaying = false;
    elements.startBtn.disabled = false;
    
    const message = isWin 
        ? `恭喜你赢了！\n最终得分：${gameState.score}`
        : `时间到！\n最终得分：${gameState.score}`;
    
    setTimeout(() => alert(message), 300);
}

// 重启游戏
function restartGame() {
    clearInterval(gameState.timer);
    gameState.matchedPairs = [];
    gameState.score = 0;
    gameState.selectedWord = null;
    elements.startBtn.disabled = false;
    
    shuffleArray(gameState.words);
    renderWords();
    updateUI();
}

// 更新界面
function updateUI() {
    elements.score.textContent = gameState.score;
    elements.remaining.textContent = 
        gameState.words.length - gameState.matchedPairs.length;
}

// 切换音效
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundBtn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

// 打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 设置事件监听
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.soundBtn.addEventListener('click', toggleSound);
    window.addEventListener('resize', setupCanvas);
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
