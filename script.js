import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const game_board = document.getElementById("game-board");

var board_area = 4;
const grid = new Grid(game_board, board_area);
grid.getRandomEmptyCell().linkTile(new Tile(game_board));
grid.getRandomEmptyCell().linkTile(new Tile(game_board));

setupInputOnce();


function setupInputOnce(){
    window.addEventListener("keydown", handleInput, {once : true});
}

function handleInput(event){
    switch (event.key){
        case "ArrowUp":
            moveUp();
            break;

        case "ArrowDown":
            // moveDown();
            break;

        case "ArrowRight":
            // moveRight();
            break;

        case "ArrowLeft":
            // moveLeft();
            break;

        default:
            setupInputOnce();
            return;
        
                                    
    }

    function moveUp(){
        slideTiles(grid.cellsGroupedByColumn);
    }

    function slideTiles(groupCells){
        // console.log(groupCells);
        groupCells.forEach(group => slideTilesInGroup(group));
    }

    function slideTilesInGroup(group){
        for (let i = 1; i < group.length; i++) {
            if(group[i].isEmpty()){
                continue;
            }  

            const cellWithTile = group[i];

            let targetCell, j = i-1;

            while(j >= 0 && group[j].canAccept(cellWithTile.linkedTile)){
                targetCell = group[j--];
            }

            if(!targetCell){
                continue;
            }

            if(targetCell.isEmpty()){
                targetCell.linkTile(cellWithTile.linkedTile);
            }else{
                targetCell.linkTileForMerge(cellWithTile.linkedTile);
            }

            cellWithTile.unlinkTile();        
        }
    }
}