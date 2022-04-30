function getid(str) {
    return document.getElementById(str);
}
let checkers_score = getid("checkers_score");
let minesweeper_score = getid("minesweeper_score");
let sudoku_score = getid("sudoku_score");
let politeness_score = getid("politeness_score");

if (localStorage.getItem("checkers_score")==null) {
    checkers_score.innerHTML = 0;
} else checkers_score.innerHTML = localStorage.getItem("checkers_score");

if (localStorage.getItem("minesweeper_score")==null){
    minesweeper_score.innerHTML = 0;
} else minesweeper_score.innerHTML = localStorage.getItem("minesweeper_score");

if (localStorage.getItem("sudoku_score")==null){
    sudoku_score.innerHTML = 0;
} else sudoku_score.innerHTML = localStorage.getItem("sudoku_score");

if (localStorage.getItem("politeness_score")==null){
    politeness_score.innerHTML = 0;
} else politeness_score.innerHTML = localStorage.getItem("politeness_score");