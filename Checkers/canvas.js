const canvas = document.getElementById('Checkers');
const context = canvas.getContext('2d');

context.scale(100, 100);

function createMatrix(w, h) {
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

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,canvas.height);

    drawMatrix(board);
}

function drawMatrix(matrix){
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function update() {
    draw();
    requestAnimationFrame(update);
}

const board = createMatrix(8,8);

const colors = [
    null,
    'black',
    'red'
];

context.strokeStyle = 'grey';
context.fillStyle = 'blue';
context.lineWidth = 5;
context.beginPath();
context.arc(100, 100, 100, 0, 2 * Math.PI);
context.stroke();
context.fill();

update();