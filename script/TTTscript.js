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
var boardID = [0,1,2,3,4,5,6,7,8]
var iter = 0

startGamehvh()

hvh.addEventListener('click', startGamehvh)
hvc.addEventListener('click', startGamehvc)
cvc.addEventListener('click', startGamecvc)

function startGamehvh(){
    begTurn()
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleClick, {once:true})
    })
}

function startGamehvc(){
    begTurn()
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleclickhvc, {once:true})
    })
    aiPlaceMark()
}

function startGamecvc(){
    begTurn()
    let i = Math.floor(Math.random() * 9)
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        handleclickcvc()
    })
    aiPlaceMark()
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
    checkingWin()
}

function checkingWin(){
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    if (checkWin(currentClass)){ endGame(false) }
    else if (isDraw()){ endGame(true) }
    else{
        switchTurns()
    }
}

function placeMark(cell, currentClass){
    if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)){
        cell.classList.add(currentClass)
    } else{
        placeMark(cell,currentClass)
    }
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
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
    })    
}

function endGamehvc(draw){
    if (draw){
        winningMessageTextElement.innerText = 'Draw!'
    }
    else {
        if (beginTurn){
            winningMessageTextElement.innerText = `${circleTurn ? "You Win" : "You Lose"}!`
            localStorage.setItem(
                "ttt_score",
                Number(localStorage.getItem("ttt_score"))+1
            );
        }
        else {winningMessageTextElement.innerText = `${circleTurn ? "You Lose" : "You Win"}!`}
    }
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleclickhvc)
    })    
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

function handleclickhvc(e){
    const cell = e.target
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    checkingWinhvc()
    aiPlaceMark(cell)
    checkingWinhvc()
}

function checkingWinhvc(){
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    if (checkWin(currentClass)){ endGamehvc(false) }
    else if (isDraw()){ endGamehvc(true) }
    else{
        switchTurns()
    }
}

function handleclickcvc(){
    let i = Math.floor(Math.random() * 9)
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    setTimeout(function(){
    if (circleTurn != beginTurn){
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)){
            cellElements[i].classList.add(currentClass)
            checkingWinhvc()
        }
    } else {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)){
            cellElements[i].classList.add(currentClass)
            checkingWinhvc()
        }
    }
}, 300)
    return aiPlaceMark()
}

function aiPlaceMark(cell){
    let i = Math.floor(Math.random() * 9)
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    setTimeout(function(){
    if (circleTurn != beginTurn){
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)){
            cellElements[i].classList.add(currentClass)
            checkingWinhvc()
        }
    }
}, 300)
    return aiPlaceMark()
}

function minmax(reboard, cclass) {
    iter++
    let array = avail(reboard)
    if (checkWin(X_CLASS)){
        return {score: -10}
    }
    else if (checkWin(O_CLASS)){
        return { score: 10 }
    }
    else if (array.length === 0){
        return{score: 0}
    }
    var moves = []
    for (var i = 0;i < array.length;i++){
        var move = {}
        move.index = reboard[array[i]]
        reboard[array[i]] = cclass

        if (cclass == O_CLASS){
            var g = minmax(reboard, X_CLASS)
            move.score = g.score
        }
        else{
            var g = minmax(reboard, O_CLASS)
            move.score = g.score
        }
        reboard[array[i]] = move.index
        moves.push(move)
    }
    var bestMove
    if (cclass === O_CLASS){
        var bestScore = -10000
        for (var i = 0;i < moves.length; i++){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score
                bestMove = i
            }
        }
    } else{
        var bestScore = 10000
        for (var i = 0;i < moves.length;i++){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score
                bestMove = i
            }
        }
    }
    return moves[bestMove]
}

function avail(reboard){
    return [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    })
}

function comp(){
    let i = Math.floor(Math.random() * 9)
    while (cellElements[i].classList.contains(O_CLASS) || cellElements[i].classList.contains(X_CLASS)){
        i = Math.floor(Math.random() * 9 + 1)
    }
    const cell = cellELements[i]
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    checkingWin()
}
