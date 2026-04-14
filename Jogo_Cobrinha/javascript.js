const playboard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Carrega o high score corretamente
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pressione OK para reiniciar...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Suporte para clique/touch nos controles visuais
controls.forEach(button => {
    button.addEventListener("click", () => {
        changeDirection({ key: button.dataset.key });
    });
});

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Quando come a comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        // Atualiza high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
        }

        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Movimento da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    // Move o corpo acompanhando a cabeça
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Colisão com parede
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    
    // Colisão com o próprio corpo
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            gameOver = true;
            break;
        }
    }


    // Renderiza a cobra
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    playboard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);