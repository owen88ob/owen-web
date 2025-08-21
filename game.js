document.addEventListener('DOMContentLoaded', () => {

    // 获取 DOM 元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreDisplay = document.getElementById('finalScore');
    
    // 游戏参数
    const gridSize = 20;
    const canvasSize = canvas.width;
    let snake, food, score, direction, gameInterval, isGameOver;

    // 初始化游戏状态
    function init() {
        snake = [{ x: 8, y: 8 }]; // 蛇的初始位置（格子坐标）
        food = {};
        score = 0;
        direction = 'right';
        isGameOver = false;

        scoreDisplay.textContent = score;
        gameOverScreen.classList.remove('visible');
        gameOverScreen.classList.add('hidden');
        
        generateFood();
        draw();
    }
    
    // 绘制游戏元素
    function draw() {
        // 清空画布
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--game-bg').trim();
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // 绘制蛇
        snake.forEach((segment, index) => {
            ctx.fillStyle = (index === 0) 
                ? getComputedStyle(document.documentElement).getPropertyValue('--snake-head').trim() 
                : getComputedStyle(document.documentElement).getPropertyValue('--snake-body').trim();
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });

        // 绘制食物
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food-color').trim();
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }
    
    // 游戏主循环
    function update() {
        if (isGameOver) return;

        // 计算新蛇头的位置
        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 碰撞检测
        if (
            head.x < 0 || head.x >= canvasSize / gridSize ||
            head.y < 0 || head.y >= canvasSize / gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }

        // 将新蛇头添加到蛇的身体
        snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            generateFood();
        } else {
            snake.pop(); // 如果没吃到食物，移除蛇尾
        }
        
        draw();
    }

    // 生成食物
    function generateFood() {
        while (true) {
            food = {
                x: Math.floor(Math.random() * (canvasSize / gridSize)),
                y: Math.floor(Math.random() * (canvasSize / gridSize))
            };
            // 确保食物不生成在蛇的身体上
            if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                break;
            }
        }
    }

    // 游戏结束处理
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        finalScoreDisplay.textContent = score;
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.classList.add('visible');
        startButton.textContent = "重新开始";
    }

    // 键盘事件处理
    function handleKeyPress(e) {
        const key = e.key;
        if (key === 'w' && direction !== 'down') direction = 'up';
        else if (key === 's' && direction !== 'up') direction = 'down';
        else if (key === 'a' && direction !== 'right') direction = 'left';
        else if (key === 'd' && direction !== 'left') direction = 'right';
    }

    // 开始游戏
    function startGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        init();
        gameInterval = setInterval(update, 120); // 游戏速度，值越小越快
        startButton.textContent = "游戏中...";
    }

    // 事件监听
    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
    
    // 页面加载时初始化
    init();
});
