export class Cell{
    constructor(gridElement, row, col){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridElement.append(cell);
        this.y = col;
        this.x = row;
    }

    linkTile(tile){
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    isEmpty(){
        return !this.linkedTile;
    }
}