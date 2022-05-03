const canvas = document.getElementById('Checkers');
const context = canvas.getContext('2d');
const scale = 75;
context.scale(scale, scale);
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restart = document.getElementById('restart');

const ROWS = 8;
const COLS = 8;


let blackKings = 0;
let board = createBoard(ROWS,COLS);
let pieces = createPieces(ROWS,COLS);
let valid = createValid(ROWS,COLS);
let pos = {x: 0, y: 0};
let turn = true;
let selected = {x: null, y: null};
let whiteKings = 0;
let winner = false;

const boardColors = [
    null,
    '#964B00',
    '#F6E8B1'
];

const pieceColors = [
    '#FFFDD1',
    'black',
    null,
];

const pieceDirections = [
    1,
    -1,
];

function arraysEqual(a, b) {
    // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }


function checkAll() {
    let allMoves = {};
    pieces.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value % 2 == turn % 2 && value != 0) {
                allMoves[[y, x]] = Object.assign({}, validMoves({"x": x, "y": y}, y, x,[],1), validMoves({"x": x, "y": y}, y, x,[],2));
            }
        });
    });
    return allMoves;
}

function checkWin() {
    let numMoves = 0;
    for (let i = 0; i < Object.keys(checkAll()).length; i++) {
        if (Object.keys(Object.values(checkAll())[i]).length != 0) {
            numMoves++;
        }
    }
    if (numMoves == 0) {
        winner = true;
        if (turn % 2 == 0) {
            winningMessageTextElement.innerText = 'Black Wins!'
        } else {
            winningMessageTextElement.innerText = 'White Wins!'
        }
        return true;
    }
    return false;   
}

function clearValid() {
    valid.forEach((row, y) => {
        row.fill(0);
    });
}

function createBoard(w, h) {
    const matrix = [];
    while (h--) {
        if (h % 2 === 1) { 
            matrix.push(new Array(2,1,2,1,2,1,2,1));
        } else {
            matrix.push(new Array(1,2,1,2,1,2,1,2));
        }
    }
    return matrix;
}

function createPieces(w, h) {
    const matrix = [];
    while (h--) {
        if (h === 7 || h === 5) { 
            matrix.push(new Array(0,2,0,2,0,2,0,2));
        } else if (h === 6) {
            matrix.push(new Array(2,0,2,0,2,0,2,0));
        } else if (h === 4 || h === 3) {
            matrix.push(new Array(0,0,0,0,0,0,0,0));
        } else if (h === 2 || h === 0) {
            matrix.push(new Array(1,0,1,0,1,0,1,0));
        } else if (h === 1) {
            matrix.push(new Array(0,1,0,1,0,1,0,1));
        }
    }
    return matrix;
}

function createValid(w,h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(0,0,0,0,0,0,0,0));
    }
    return matrix;
}

function draw() {
    drawBoard(board);
    drawPieces(pieces,selected);
    drawValid(valid);
}

function drawBoard(matrix){
    context.globalAlpha = 1;
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            context.fillStyle = boardColors[value];
            context.fillRect(x, y, 1, 1);
        });
    });
}

function drawPieces(matrix,s){
    context.globalAlpha = 1;
    if (s.x != null && s.x < ROWS) {
        context.fillStyle = 'lime';
        context.beginPath();
        context.arc(s.x+.5, s.y+.5, .4, 0, 2 * Math.PI);
        context.fill(); 
    }
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = pieceColors[value%2];
                context.beginPath();
                context.arc(x+.5, y+.5, .33, 0, 2 * Math.PI);
                context.fill();    
            }
            if (value >= 4) {
                context.fillStyle = 'yellow';
                context.beginPath();
                context.arc(x+.5, y+.5, .16, 0, 2 * Math.PI);
                context.fill(); 
            }
        });
    });
}

function drawValid(matrix){
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.globalAlpha = 0.25;
                context.fillStyle = 'lime';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function kingMe(x, y) {
    if (pieces[y][x] == 2) {
        whiteKings++;
    } else if (pieces[y][x] == 1) {
        blackKings++;
    }
    pieces[y][x] = (pieces[y][x]) % 2 + 4;
}

function startGame() {
    blackKings = 0;
    board = createBoard(ROWS,COLS);
    pieces = createPieces(ROWS,COLS);
    valid = createValid(ROWS,COLS);
    pos = {x: 0, y: 0};
    turn = true;
    selected = {x: null, y: null};
    whiteKings = 0;
}

function update() {
    draw();
    if (!winner) {
        checkWin();
    }
    requestAnimationFrame(update);
}

function updateValid(dict) {
    for (move in dict) {
        [y, space, x] = move;
        valid[Number(y)][Number(x)] = 1;
    }
}

function selectPiece() {
    if (turn === !!(pieces[pos.y][pos.x] % 2) && pieces[pos.y][pos.x] !== 0 && (selected.x != pos.x || selected.y != pos.y)) {
        selected.x = pos.x;
        selected.y = pos.y;
    } else if (selected.x === pos.x && selected.y === pos.y) {
        selected.x = null;
        selected.y = null;
    } 
}

function getMousePosition(canvas, event, position) {
    let rect = canvas.getBoundingClientRect();
    position.x = event.clientX - rect.left;
    position.y = event.clientY - rect.top;
}

canvas.addEventListener("click", event=> {
    if (winner) {
        return;
    }
    getMousePosition(canvas, event, pos);
    pos.x = Math.floor(pos.x / scale);
    pos.y = Math.floor(pos.y / scale);
    selectPiece();
    if (selected.x !== null && selected.y !== null) {
        validDict = Object.assign({}, validMoves(selected, selected.y,selected.x,[],1), validMoves(selected, selected.y,selected.x,[],2));
    } else {
        validDict = {};
    }
    clearValid();
    updateValid(validDict);
    if (validDict[[pos.y,pos.x]]) {
        [pieces[pos.y][pos.x], pieces[selected.y][selected.x]] = [pieces[selected.y][selected.x], pieces[pos.y][pos.x]];
        if (pos.y == 0 || pos.y == ROWS - 1) {
            kingMe(pos.x,pos.y);
        }
        selected.x = null;
        selected.y = null;
        clearValid();
        for (let i = 0; i < validDict[[pos.y,pos.x]].length; i++) {
            let y = validDict[[pos.y,pos.x]][i][0];
            let x = validDict[[pos.y,pos.x]][i][1];
            pieces[y][x] = 0;
        }
        turn = !turn;
        winningMessageTextElement.innerText = `${turn ? "Black" : "White"}'s Turn`
    }
});

function canJump (piece, oldRow, oldCol, newRow, newCol, step) {
    if (!(pieces[piece.y][piece.x] >= 4 || newRow === oldRow + pieceDirections[pieces[piece.y][piece.x]%2]*step)) {
        return false;
    }
    if (!(0 <= newRow && newRow < ROWS && 0 <= newCol && newCol < COLS)) {
        return false;
    }
    newLocation = pieces[newRow][newCol];
    if (newLocation !== 0) {
        return false;
    }
    if(step === 2) {
        middleRow =  (oldRow + newRow) / 2;
        middleCol = (oldCol + newCol) / 2;
        middlePiece = pieces[middleRow][middleCol];
        if (middlePiece === 0 || middlePiece%2 === pieces[piece.y][piece.x]%2) {
            return false;
        }
    }
    return true;
}

function validMoves(piece, row, col, path, step) {
    let up = row - 1*step;
    let down = row + 1*step;
    let left = col - 1*step;
    let right = col + 1*step;

    let moves = {};

    for (newCol of [left, right]) {
        for (newRow of [up, down]) {
            leave = 0;
            if (newCol == right && newRow == up) {
            }
            if(!canJump(piece, row, col, newRow, newCol, step)) {
                continue;
            }
            if (step === 1) {
                moves[[newRow, newCol]] = [];
            } else {
                middleRow = (newRow + row) / 2;
                middleCol = (newCol + col) / 2;
                for (let i = 0; i < path.length; i++) {
                    if(arraysEqual([middleRow,middleCol],path[i])){
                        leave++;
                    }
                }
                if (leave) {
                    continue;
                }
                let newPath = Object.assign([],path);
                newPath.push([middleRow,middleCol]);
                moves[[newRow, newCol]] = newPath;
                moves = Object.assign({}, moves, validMoves(piece, newRow, newCol, newPath, step));
            }
        }
    }
    return moves;
}
winningMessageTextElement.innerText = `Black's Turn`
update();
restart.addEventListener('click', startGame)