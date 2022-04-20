'use strict'

class Minesweeper {




    constructor(grid,flag_display){       
        
        this.rows = 15
        this.columns = 18;
        this.n_mines = 50;
        this.flag_counter = this.n_mines;
        this.remaining_tiles = this.rows*this.columns-this.n_mines;
        this.flag_display = flag_display;
        let instance = this;
        
        this.flag_display.innerHTML = this.flag_counter;


        grid.innerHTML = "";
        this.reference_array = [];

        let row, cell;
        
        
        for(let i = 0; i<this.rows;i++){
            row = grid.insertRow(i);
            this.reference_array.push([]);
            for( let j  = 0; j<this.columns;j++){
                this.reference_array[i].push(row.insertCell(j));
                cell = this.reference_array[i][j]
                cell.onmousedown = function() {
                    let click = window.event.which;
                    if (click == 3){
                        if(this.className == "hidden"){
                            this.className = "flagged"
                            this.innerHTML = "<img src=\"images/minesweeper_flag.jpg\" width=16px height=13px>"
                            instance.flag_counter = instance.flag_counter - 1;
                            instance.flag_display.innerHTML = instance.flag_counter;
                        }
                        else if(this.className == "flagged"){
                            this.className = "hidden"
                            this.innerHTML = ""
                            instance.flag_counter = instance.flag_counter + 1;
                            instance.flag_display.innerHTML = instance.flag_counter;
                        }
                        console.log(flag_counter);
                    }
                    if (click == 1){
                        instance.reveal(this);
                    }
                }
                cell.setAttribute('val',0);
                cell.setAttribute('i',i)
                cell.setAttribute('j',j)
                cell.addEventListener('contextmenu', function(ev) {
                    ev.preventDefault();
                    return false;
                }, false);

                cell.className = "hidden";
            }
        }

        this.board_drawn = false;
        this.game_over = false;
    }

    

    create_board(reserved_tile){
        let available_tiles = [];
        for (let i = 0; i <this.rows; i++){
            for (let j = 0; j <this.columns; j++){
                available_tiles.push([i,j]);
            }
        }

        let tile;
        const reserved_tiles = [reserved_tile]
        for (let di = -1; di <2; di++){ //remove tiles surrounding the player's first click so every game is playable
            for (let dj = -1; dj <2; dj++){
                tile = [reserved_tile[0]+di,reserved_tile[1]+dj]
                available_tiles.splice(
                    available_tiles.findIndex((element) => element[0] == tile[0] && element[1] == tile[1]),
                    1
                ); 
                reserved_tiles.push(tile)
            }
        }
        let I, J;
        let mine_tile
        

        let x;
        let tile_i
        for (let i = 0; i < this.n_mines; i++){ //place mines
            x = this.randint(0,available_tiles.length-1)
            mine_tile = available_tiles.splice(x,1);
            mine_tile = mine_tile[0];

            I = mine_tile[0];
            J = mine_tile[1];
            
            this.reference_array[I][J].setAttribute('val',-1);

            
            for (let di = -1; di <2; di++){ //increment the bomb count of all surrounding tiles 
                for (let dj = -1; dj <2; dj++){
                    if ((di != 0 || dj != 0) && 
                        this.in_bounds(I+di,J+dj) &&
                        (this.value(this.reference_array[I+di][J+dj])!=-1)){
                            tile_i = this.reference_array[I+di][J+dj]
                            tile_i.setAttribute(
                                'val',
                                this.value(tile_i)+1
                            )

                    }
                } 
            }
            
        }
        
    }

    board_log(){
        const board = []
        for (let i = 0; i<this.rows;i++){
            board.push([])
            for(let j = 0; j<this.columns; j++){
                board[i].push(this.reference_array[i][j].getAttribute('val'))
            }
        }
        console.log(board);
    }

    randint(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    value(cell){
        return Number(cell.getAttribute('val'))
    }

    reveal(cell){
        if (cell.className == "flagged"){
            return;
        }


        let pos = [
            Number(cell.getAttribute('i')),
            Number(cell.getAttribute('j'))
        ];
        if (this.board_drawn==false){
            this.create_board(pos);
            this.board_drawn = true;
        }
        
        let zero_tiles = [];
        cell.innerHTML = cell.getAttribute("val");
        cell.className = "revealed";


        if(this.value(cell)==-1){
            this.game_over=true; //mine!
            //reveal all
            for (let i = 0; i<this.rows; i++){
                for (let j = 0; j<this.columns; j++){
                    this.reference_array[i][j].innerHTML = this.value(this.reference_array[i][j]);
                }
            }
        } else {

            this.remaining_tiles--;

            if (this.value(cell) == 0){
            zero_tiles.push(pos);
            }
        }

        let I, J, tile_i,val_i;
        let zero_tile;
        while(zero_tiles.length!=0){
            I = zero_tiles[0][0];
            J = zero_tiles[0][1];

            zero_tiles.splice(0,1);
            for (let di = -1; di <2; di++){
                for (let dj = -1; dj <2; dj++){
                    if (this.in_bounds(I+di,J+dj)){
                        tile_i = this.reference_array[I+di][J+dj]
                        if(tile_i.className=='hidden'){
                            val_i = this.value(tile_i)
                            tile_i.innerHTML = val_i;  
                            tile_i.className = "revealed"  
                            this.remaining_tiles--;                        
                            if(val_i == 0){        
                                zero_tiles.push([I+di, J+dj]);
                            }
                        }
                    }
                }
            }
        }
        if (this.remaining_tiles == 0) { //win condition
            console.log("you win!")
        }

    }



    in_bounds(i,j){
        if (i>=0 && j>=0 && i<this.rows && j<this.columns) return true;
        return false;
    }
}



let GUI = document.getElementById("grid");
document.getElementById("restart").onclick = function () {
    board = new Minesweeper(GUI)
};

let timer = document.getElementById("timer");
let flag_counter = document.getElementById("flag-count")
let time_elapsed = 0;


setInterval(increment_time(),1000)





let board = new Minesweeper(GUI,flag_counter)




function increment_time() {
    time_elapsed = time_elapsed+1;
    timer.innerHTML = time_elapsed;
}