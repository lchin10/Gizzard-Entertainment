
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
const hva = document.getElementById('hva')
const cvc = document.getElementById('cvc')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn = true
let beginTurn = true
let boardID = [0,1,2,3,4,5,6,7,8]
let iter = 0

startGamehvh()

hvh.addEventListener('click', startGamehvh)
hvc.addEventListener('click', startGamehvc)
hva.addEventListener('click', startGamehva)
cvc.addEventListener('click', startGamecvc)

function startGamehvh(){
    begTurn()
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickhva)
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
        cell.removeEventListener('click', handleclickhva)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleclickhvc, {once:true})
    })
    aiPlaceMark()
}

function startGamehva(){
    begTurn()
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickhva)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.addEventListener('click', handleclickhva, {once:true})
    })
    handleclickhva()
}

function startGamecvc(){
    document.getElementById("transbox").style.visibility = "visible"
    begTurn()
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
        cell.removeEventListener('click', handleclickhvc)
        cell.removeEventListener('click', handleclickhva)
        cell.removeEventListener('click', handleclickcvc)
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
    })
    handleclickcvc()
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

function endGamehva(draw){
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
            cell.removeEventListener('click', handleclickhva)
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

function checkWin2(currentBoard, currentClass) {
    let currClass = (currentClass == O_CLASS) ? 'o' : 'x';
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return currentBoard[index] === currClass;
      });
    });
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

function handleclickhva(e){
    const cell = e.target
    let currentClass = circleTurn ? O_CLASS : X_CLASS

    placeMark(cell, currentClass)
    checkingWinhva()

    if (!checkWin(currentClass) && !isDraw()) {
        setTimeout(minmaxStart, 300);
    }
}

function checkingWinhva(){
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    if (checkWin(currentClass)){ endGamehva(false) }
    else if (isDraw()){ endGamehva(true) }
    else{
        switchTurns()
    }
}

function checkingWincvc(){
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    if (checkWin(currentClass)){
        endGame(false)
        document.getElementById("transbox").style.visibility = "hidden"
    }
    else if (isDraw()){
        endGame(true)
        document.getElementById("transbox").style.visibility = "hidden"
    }
    else{
        switchTurns()
    }
}

function handleclickcvc(){
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    let i = Math.floor(Math.random() * 9)
    if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS) && !checkWin(currentClass)){
        setTimeout(function(){
            cellElements[i].classList.add(currentClass)
            checkingWincvc()
        }, 300)
    }
    if (!checkWin(currentClass) && !isDraw()){
        setTimeout(handleclickcvc, 300)
    }
}

function aiPlaceMark(cell){
    let i = Math.floor(Math.random() * 9)
    const currentClass = circleTurn ? O_CLASS : X_CLASS
    setTimeout(function(){
        if (circleTurn != beginTurn){
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS) && !checkWin(currentClass)){
                cellElements[i].classList.add(currentClass)
                checkingWinhvc()
            }
        }
    }, 200)
    return aiPlaceMark()
}

function avail(reboard) {
    const availableCells = [];
    reboard.forEach((cell, index) => {
        if (cell != 'o' && cell != 'x') {
            availableCells.push(index);
        }
    });
    return availableCells;
}

function minmaxStart(){
    let currentClass = circleTurn ? O_CLASS : X_CLASS;
    function getCurrBoard() {
        const boardState = [];
        cellElements.forEach(cell => {
            if (cell.classList.contains(X_CLASS)) {
                boardState.push('x');
            } else if (cell.classList.contains(O_CLASS)) {
                boardState.push('o');
            } else {
                const index = Array.from(cellElements).indexOf(cell);
                boardState.push(index);
            }
        });
      
        return boardState;
    }
    console.log('initial: ',getCurrBoard());
    const bestMove = minmax(getCurrBoard(),currentClass,currentClass).index;
    console.log(bestMove);
    cellElements[bestMove].classList.add(currentClass);
    checkingWinhva();
}

function minmax(reboard, cclass, compClass) {
    console.log(reboard);
    const humClass = (compClass == O_CLASS) ? X_CLASS : O_CLASS;
    iter++;

    let array = avail(reboard);
    console.log('array: ',array);

    if (checkWin2(reboard,compClass)) {
        return { score: 10 };
    } else if (checkWin2(reboard,humClass)) {
        return { score: -10 };
    } else if (array.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < array.length; i++) {
        let move = {};
        move.index = reboard[array[i]];
        reboard[array[i]] = (cclass == O_CLASS) ? 'o' : 'x';

        if (cclass === compClass) {
            let g = minmax(reboard, humClass, compClass);
            move.score = g.score;
            console.log('score: ',move.score);
        } else {
            let g = minmax(reboard, compClass, compClass);
            move.score = g.score;
            console.log('score: ',move.score);
        }

        reboard[array[i]] = move.index;
        moves.push(move);
        console.log('moves1: ',moves);
    }

    let bestMove;
    console.log('moves: ',moves)
    if (cclass === compClass) {
        let bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                console.log('bmove: ',moves[bestMove].index);
            }
        }
    } else {
        let bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                console.log('bmove: ',bestMove);
            }
        }
    }
    
    return moves[bestMove];
}
