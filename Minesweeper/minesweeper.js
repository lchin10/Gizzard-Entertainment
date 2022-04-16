class Minesweeper {
    constructor(grid,difficulty){
        
        if (difficulty==1){
            this.rows = 8
            this.columns = 10;
            this.n_mines = 10;
        }
        grid.innerHTML = "";
        this.reference_array = [];

        let row, cell;
        for(let i = 0; i<this.rows;i++){
            row = grid.insertRow(i);
            this.reference_array.push([]);
            for( let j  = 0; j<this.columns;j++){
                cell = row.insertCell(j);
                cell.onclick = function() {
                    reveal(this);
                }

                cell.setAttribute('i',i);
                cell.setAttribute('j',j);
                cell.setAttribute('val',0);
                cell.innerHTML = "o"
                this.reference_array[i].push(cell);
            }
        }

        this.board_drawn = false;
        this.game_over = false;
    }

    create_board(cell){
        let available_tiles = [];
        let reserved_tile = [
            Number(cell.getAttribute('i')), 
            Number(cell.getAttribute('j'))
        ];
        for (let i = 0; i <this.rows; i++){
            for (let j = 0; j <this.columns; j++){
                available_tiles.push([i,j]);
            }
        }


        for (let di = -1; di <2; di++){ //remove tiles surrounding the player's first click so every game is playable
            for (let dj = -1; dj <2; dj++){

                tile = [reserved_tile[0]+di,reserved_tile[1]+dj]
                available_tiles.splice(
                    available_tiles.findIndex((element) => element[0] == tile[0] && element[1] == tile[1]),
                    1
                ); 

            }
        }

        let I, J;
        let mine_tile
        

        let x;
        for (let i = 0; i < this.n_mines; i++){ //place mines
            x = this.randint(0,available_tiles.length-1)
            mine_tile = available_tiles.splice(x,1);
            mine_tile = mine_tile[0];

            I = mine_tile[0];
            J = mine_tile[1];
            
            this.reference_array[I][J].getAttribute("val")=-1;

            
            for (let di = -1; di <2; di++){ //increment the bomb count of all surrounding tiles 
                for (let dj = -1; dj <2; dj++){
                    if ((di != 0 || dj != 0) && (di + I >= 0) && (dj + J >= 0) && (di+I <this.rows) && (dj+J <this.columns) && (this.board[I+di][J+dj]!=-1)){
                        this.reference_array[I+di][J+dj].getAttribute("val")++
                    }
                } 
            }
            
        }
    }

    reveal(cell){
        if (this.board_drawn==false){
            create_board(cell);
        }
        cell.innerHTML = "clicked"
        
        zero_cells = [];

        let i = Number(cell.getAttribute('i'));
        let j = Number(cell.getAttribute('j'));
        


        cell.innerHTML = cell.getAttribute("val");

        if (this.board[i][j] == 0){
            zero_tiles.push([i,j]);
        } else if(this.board[i][j]==-1){
            this.game_over=true; //mine!
            //reveal all
            for (let i = 0; i<this.rows; i++){
                for (let j = 0; j<this.columns; j++){
                    this.reference_array[i][j].innerHTML = this.reference_array[i][j].getAttribute("val");
                }
            }
        }
        

        let I, J;
        while(zero_tiles.length!=0){
            I = zero_tiles[0][0];
            J = zero_tiles[0][1];
            zero_tiles.splice(0,1);
            for (let di = -1; di <2; di++){
                for (let dj = -1; dj <2; dj++){
                    if (this.player_board[i+di][j+dj]==-2){ //if a tile next to a zero tile hasn't been revealed
                        this.reference_array[i+di][j+dj].innerHTML=this.reference_array[i+di][j+dj].getAttribute("valS");
                        if (this.board[i+di][j+dj]==0){
                            zero_tiles.push([i+di,j+dj]);
                        }
                    }
                }
            }
        }

    }
}

let GUI = document.getElementById("grid");
console.log(GUI)
let board = new Minesweeper(GUI,1);