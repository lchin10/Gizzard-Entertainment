const X_CLASS = 'x'
const O_CLASS = 'o'
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const restart = document.getElementById('restartButton')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn = false
let beginTurn = false

startGame()

restart.addEventListener('click', startGame)

function startGame(){
    begTurn()
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        
        cell.addEventListener('click', handleClick, {once:true})
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

function begTurn(){
    if (!beginTurn){circleTurn}
    else {!circleTurn}
    beginTurn = !beginTurn
}

function handleClick(e){
    const cell = e.target
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)){ endGame(false) }
    else if (isDraw()){ endGame(true) }
    else{
        switchTurns()
        setBoardHoverClass()
    }
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function switchTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if (circleTurn){ board.classList.add(O_CLASS) }
    else { board.classList.add(X_CLASS) }
}

function endGame(draw){
    if (draw){
        winningMessageTextElement.innerText = 'Draw!'
    }
    else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    winningMessageElement.classList.add('show')
    cell.removeEventListener('click', handleClick)
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}
