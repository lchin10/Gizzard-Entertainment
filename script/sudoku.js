/*
 *
 * Copyrighted (c) <2021> <Noah Robitshek> <noahro@bu.edu>  All Rights Reserved.
 * 
 * Filename: sudoku.js
 *
 * Description: Backend logic and logic for board game. 
 * 
 * Project: <EC 327 Project> 
 *
 * Creator: <Noah Robitshek>   <NR>
 * 
 *
 */ 

const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Create variables
var timer;
var timeRemaining;
var lives
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function() {
    // run startgame function when button is clicked

    id("start-btn").addEventListener("click", startGame);

    for(let i = 0; i < id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click",function(){
            // if selecting is not disabled
            if(!disableSelect){
                // If number is already selectedd
                if(this.classList.contains("selected")){
                    //Then remove selection
                    this.classlist.remove("selected");
                    selectedNum = null;
                } else{
                    // deslect all other numbers
                    for(let i = 0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected"); 
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        })
    }
}


function startGame(){
    // choose board difficuliy
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];
    // set lives to 3 and enable selecting numbers and tiles;
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 3";
    // Created board baised on difficulty:
    generateBoard(board);
    // Start timmer
    startTimer();
    // add tile to bord
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else{
        qs("body").classList.add("dark");
    }
    // add other colors

    // show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //sets timmer baised on input
    if(id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    // sets timer for the first second
    id("timer").textContent = timeConversion(timeRemaining);
    // sets timer to update every second
    timer = setInterval(function () {
        timeRemaining --;
        // endgame if time is 0
        if (timeRemaining == 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)

}
// convert seconds into string of mm ss format
function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board){
    // Clear any previous boards
    clearPrevious();
    // let used to incriment tile ids
    let idCount = 0;
    // create 81 tiles
    for(let i = 0; i < 81; i++){
        // create a new paragraph element
        let tile = document.createElement("p");
        
        if (board.charAt(i) != "-"){
            tile.textContent = board.charAt(i);
        } else{
            // add click event listener to tile
            tile.addEventListener("click", function(){
                // if selecting is not disabled
                if(!disableSelect){
                    // if the tile is already selected
                    if (tile.classList.contains("selected")){
                        // Then remove the selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else{
                        for(let i = 0; i < 81; i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }
        // adding tile id
        tile.id = idCount;
        // incriment next tile
        idCount++;
        // add tile clas to all tiles
        tile.classList.add("tile");

        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if (((tile.id + 1) % 9 == 3) || (tile.id +1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        // add tile to bord
        id("board").appendChild(tile);
    }
}

function clearPrevious(){
    // Access all tiles
    let tiles = qsa(".tile");
    // Remove each tile
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }
    // If there is a timer, clear it
    if(timer) clearTimeout(timer);
    // Deselect any numbers
    for(let i = 0; i < id("number-container").children.length; i++){
        id("number-container").children[i].classList.remove("selected");
    }
    selectedTile = null;
    selectedNum = null;
}
function updateMove(){
    // if tile and number is selected
    if (selectedTile && selectedNum){
        // set tile to number
        selectedTile.textContent = selectedNum.textContent;
        // If correct
        if(checkCorrect(selectedTile)){
            // Deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            // clear the selected variables
            selectedNum = null;
            selectedTile = null;
            if (checkDone()) {
                endGame();
            }
        } else{
            disableSelect = true;
            // then make the tile turn red
            selectedTile.classList.add("incorrect");
            // run in one second
            setTimeout(function(){
                // subtract lives
                lives --;
                if(lives == 0) {
                    endGame();
                } else{
                    // update the lives if it changes
                    id("lives").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }
                //Restore tile color
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                selectedTile.textContent = " ";
                selectedTile = null;
                selectedNum = null; 
           }, 1000)   
        }
    }
}
function checkCorrect(tile){
    let solution;
    // change difficulty 
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];

    if(solution.charAt(tile.id) == tile.textContent) return true;
    else return false;
    
}
function endGame(){
    // disable time and stop timer
    disableSelect = true;
    clearTimeout(timer);
    if (lives == 0 || timeRemaining == 0){
        id("lives").textContent = "You Lost";
    } else {
        id("lives").textContent = "You Won"
        localStorage.setItem(
            "sudoku_score",
            Number(localStorage.getItem("sudoku_score"))+1
        );
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for(let i = 0; i < tiles.length; i++){
        if (tiles[i].textContent == "") return false; 
    }
    return true;
}

// Helper functions
function id(id) {
    return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}
function qsa(selector){
    return document.querySelectorAll(selector);
}

