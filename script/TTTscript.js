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
const hvh = document.getElementById('hvh')
const hvc = document.getElementById('hvc')
const cvc = document.getElementById('cvc')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn = true
let beginTurn = true

startGamehvh()

hvh.addEventListener('click', startGamehvh)
hvc.addEventListener('click', startGamehvc)
cvc.addEventListener('click', startGamecvc)

function startGamehvh(){
    begTurn()
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleClick, {once:true})
    })
}

function startGamehvc(){
    begTurn()
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleClick, {once:true})
    })
}

function startGamecvc(){
    begTurn()
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        setTimeout(() => { comp()}, 200)
    })
}

function begTurn(){
    if (!beginTurn){circleTurn = true}
    else {circleTurn = false}
    beginTurn = !beginTurn
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"}'s Turn`
}

function handleClick(e){
    const cell = e.target
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)){ endGame(false) }
    else if (isDraw()){ endGame(true) }
    else{
        switchTurns()
    }
}

function comp(){
    var i = Math.floor(Math.random() * 9 + 1)
    while (cellElements[i].classList.contains(O_CLASS) || cellElements[i].classList.contains(X_CLASS)){
        i = Math.floor(Math.random() * 9 + 1)
    }
    const cell = cellELements[i]
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)){ endGame(false) }
    else if (isDraw()){ endGame(true) }
    else{
        switchTurns()
    }
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function switchTurns(){
    circleTurn = !circleTurn
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"}'s Turn`
}

function endGame(draw){
    if (draw){
        winningMessageTextElement.innerText = 'Draw!'
    }
    else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
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
