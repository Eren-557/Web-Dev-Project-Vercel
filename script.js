const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');

const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const blockHeight = 50;
const blockWidth = 50;

let highscoreElement = document.querySelector('#high-score');
let scoreElement = document.querySelector('#score');
let timeElement = document.querySelector('#time');

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerintervalId = null;

const blocks = [];

let food =  {x: Math.floor(Math.random()*rows),y: Math.floor(Math.random()*cols)}

let snake = [
    {
        x:1,
        y:3
    }

]

let direction = 'down'

let highScore = localStorage.getItem("highScore") || 0;
let score = 0
let time = `00-00`

highscoreElement.textContent = highScore;


// for(let i = 0; i < rows * cols; i++){
//     const block = document.createElement('div');
//     block.classList.add('block');
//     board.appendChild(block);
// }

for (let row = 0; row<rows; row++){
    for (let col = 0; col<cols; col++){
            const block = document.createElement('div');
            block.classList.add('block');
            board.appendChild(block);
            // block.innerHTML = `${row}-${col}`
            blocks[`${row}-${col}`] = block;
    };
};


function render() { //snake jaha bhi rahega render hojaega

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food')


    if (direction === 'left') {
        head = {x: snake[0].x, y: snake[0].y - 1}
    }else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1}
    }else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y}
    }else if(direction === 'up'){
        head = {x: snake[0].x  - 1, y: snake[0].y}
    }

    // wall collison logic
    if (head.x <0 || head.x >= rows || head.y <0 || head.y >=cols) {
        clearInterval(intervalId)

        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"

        return;
    }

    // food consume logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        food = {
             x: Math.floor(Math.random()*rows),y: Math.floor(Math.random()*cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add('food')

        snake.unshift(head);

        score += 10;
        scoreElement.textContent = score;

        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString())
            highscoreElement.textContent = highScore;
        }
    }

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill') 
    })

    snake.unshift(head)
    snake.pop()




    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
        
    })
}


startButton.addEventListener("click", () => {
    modal.style.display = 'none';
    intervalId = setInterval(() => { render() }, 300);

    timerintervalId = setInterval(()=>{
        let [min, sec] = time.split("-").map(Number)

        if (sec=== 59) {
            min += 1;
            sec = 0;
        }else{
            sec+= 1;
        }
        time = `${min}-${sec}`
        timeElement.innerHTML = time
    },1000)

})

restartButton.addEventListener("click", restartGame)

function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove('food')
    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill') 
    })
    score = 0;
    time = `00:00`;

    scoreElement.textContent = score;
    timeElement.textContent = time;
    highscoreElement.textContent = highScore;


    modal.style.display = 'none';
    direction = 'down'
    snake = [ { x: 1, y: 3} ];
    food = {x: Math.floor(Math.random()*rows),y: Math.floor(Math.random()*cols)};
    intervalId = setInterval(() => { render() }, 300);

    
    
}


addEventListener("keydown", (event)=>{
    
    if (event.key == 'w') {
        direction = "up"
    }else if (event.key == 's') {
        direction = "down"
    }else if (event.key == 'a') {
        direction = "left"
    }else if (event.key == 'd') {
        direction = "right"
    }
})

//phone
let touchStartX = 0;
let touchStartY = 0;

addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const minSwipeDistance = 20; // ignore tiny accidental touches

    if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
        return; // too small to count as a swipe
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // horizontal swipe
        direction = diffX > 0 ? "right" : "left";
    } else {
        // vertical swipe
        direction = diffY > 0 ? "down" : "up";
    }
}, { passive: true });