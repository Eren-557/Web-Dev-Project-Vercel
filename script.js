const board = document.querySelector('.board')

let blockHeight ;
let blockWidth ;
if (window.innerWidth < 768) {
    blockHeight = 40;
    blockWidth = 40;  // Mobile value
} else {
    blockHeight = 50; // Desktop value
    blockWidth = 50; 
}


// modal
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const endGameModal = document.querySelector(".game-over");

// gameDifficulty buttons
const gameDifficulty = document.querySelector(".game-difficulty");
const easybtn = document.querySelector(".easy-btn");
const mediumbtn = document.querySelector(".medium-btn");
const hardbtn = document.querySelector(".hard-btn");

// rows and column
const cols = Math.floor(board.clientWidth/blockWidth);
const rows = Math.floor(board.clientHeight/blockHeight);

const blocks = {};

let intervalId = null;
let timerintervalId = null;
let direction = 'down'

//snake and food coordinates
let snake = [{x: 1,y: 3}]

let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}

// game infos
let highscoreElement = document.querySelector("#highs-score");
let scoreElement = document.querySelector("#score");
let timeElement = document.querySelector("#time");

let highscore = localStorage.getItem("highscore") || 0;
highscoreElement.textContent = highscore
let score = 0;
let time = `00-00`;


// loop
for(let row = 0; row<rows; row++){
    for(let col = 0; col<cols; col++){
        let block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block)

        // block.innerText = `${row}-${col}`

        blocks[`${row}-${col}`] = block;
    }
}

function timerFunction() {
        timerintervalId = setInterval(() => {
            let [min, sec] = time.split("-").map(Number);
            if (sec === 59) {
                sec = 0;
                min+= 1
            }else{
                sec+= 1;
            }

            time = `${min}-${sec}`
            timeElement.textContent = time;
}, 1000);
}


function render() {

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food')

    if(direction === 'up'){
        head = {x: snake[0].x - 1, y: snake[0].y}
    }

    else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y}
    }

    else if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1}
    }

    else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1}
    }
    

    //game over logic
    if (head.x >= rows || head.x < 0 || head.y >= cols || head.y < 0 ) {
        clearInterval(intervalId)
        clearInterval(timerintervalId)

        modal.style.display = "flex";
        startGameModal.style.display = "none"
        endGameModal.style.display = "flex"

        return;
    }

    // if(snake.some(segment=>head.x === segment.x && head.y === segment.y)){
    //     clearInterval(intervalId)
    //     clearInterval(timerintervalId)
    //     modal.style.display = "flex";
    //     startGameModal.style.display = "none"
    //     endGameModal.style.display = "flex"
    //     return;
    // }


    // food consume logic
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}

        snake.unshift(head)

        score +=1;
        scoreElement.textContent = score;

        if (score>highscore) {
            highscore = score
            localStorage.setItem("highscore",highscore.toString())
            highscoreElement.textContent = highscore
        }
    }

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
        blocks[`${segment.x}-${segment.y}`].classList.remove('head')
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach((segment, idx)=>{
        if (idx === 0) {
            blocks[`${segment.x}-${segment.y}`].classList.add('head')
        }else{
            blocks[`${segment.x}-${segment.y}`].classList.add('fill')
        }       
    })
}


let rendertime = null;
document.querySelector(".start-btn").addEventListener("click",()=>{

    modal.style.display = 'none';
    gameDifficulty.style.display = 'flex';

    easybtn.addEventListener("click", ()=>{ gameDifficulty.style.display = 'none'; intervalId = setInterval(() => { render()}, 300); rendertime=300})

    mediumbtn.addEventListener("click", ()=>{ gameDifficulty.style.display = 'none'; intervalId = setInterval(() => { render()}, 200); rendertime=200})

    hardbtn.addEventListener("click", ()=>{ gameDifficulty.style.display = 'none'; intervalId = setInterval(() => { render()}, 100); rendertime=100})

})


document.querySelector(".restart-btn").addEventListener("click",()=>{
    modal.style.display = 'none';

    blocks[`${food.x}-${food.y}`].classList.remove('food');
    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill'); 
        blocks[`${segment.x}-${segment.y}`].classList.remove('head'); 
    })

    score = 0;
    time = `00-00`;

    scoreElement.textContent = score;
    timeElement.textContent = parseInt(time, 10)

    direction = 'down';
    snake = [{x: 1,y: 3}]
    food = {x: Math.floor(Math.random()*rows),y: Math.floor(Math.random()*cols)};


    timerFunction()

    intervalId = setInterval(() => { render()}, rendertime);
})


// direction change logic based on user input
addEventListener("keydown",(evt)=>{

    if (evt.key === 'ArrowUp' || evt.key === 'w') {
        direction = 'up'
    }
    else if (evt.key === 'ArrowDown' || evt.key === 's') {
        direction = 'down'
    }
    else if (evt.key === 'ArrowLeft' || evt.key === 'a') {
        direction = 'left'
    }
    else if (evt.key === 'ArrowRight' || evt.key === 'd') {
        direction = 'right'
    }
    
})