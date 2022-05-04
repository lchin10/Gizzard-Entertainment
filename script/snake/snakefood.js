import {onSnake, expandSnake} from './snakegame.js'
import { randomGridPosition} from './snakegrid.js'

let food = getRandomFoodPosition()
const EXPANSION_RATE = 1
export let highscore = 0

export function update()
{
   if (onSnake(food)) 
   {
       expandSnake(EXPANSION_RATE)
       highscore += 1
       food = getRandomFoodPosition()
   }
}

export function draw(gameBoard)
{
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
     
}

function getRandomFoodPosition()
{
    let newFoodPosition
    while (newFoodPosition == null || onSnake(newFoodPosition))
    {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}