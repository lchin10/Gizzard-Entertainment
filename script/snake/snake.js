import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection} from './snakegame.js'
import { update as updateFood, draw as drawFood, highscore} from './snakefood.js'
import { outsideGrid } from './snakegrid.js'

let lastRenderTime = 0
let gameOver = false
const gameBoard = document.getElementById('game-board')
const restart = document.getElementById('restartgame')
const gameStatus = document.getElementById('[gameStatus]')
const gameStatusMessage = document.querySelector('[gameStatusMessage]')

function main(currentTime)
{
    gameStatusMessage.innerText = 'USE ARROW KEYS TO MOVE!'
    if (gameOver)
    {
        gameStatusMessage.innerText = 'GAME OVER!'
        localStorage.setItem(
            "snake_score",
            highscore)
        return
    }
    window.requestAnimationFrame(main)
    const secSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secSinceLastRender < 1 / SNAKE_SPEED) return

    lastRenderTime = currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)

function update()
{
    updateSnake()
    updateFood()
    checkDeath()

}

function draw()
{
    gameBoard.innerHTML = ''
    drawSnake(gameBoard)
    drawFood(gameBoard)
}

function checkDeath()
{
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}

restart.addEventListener('click', function() {window.location = '../html/snake.html'})