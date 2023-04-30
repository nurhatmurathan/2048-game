export class Cell{
    constructor(gridElement, row, col){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridElement.append(cell);
        this.y = col;
        this.x = row;
        this.point = 0;
    }

    linkTile(tile){
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    unlinkTile(){
        this.linkedTile = null;
    }

    unlinkTileForMerge(){
        this.linkedTileForMerge = null;
    }

    linkTileForMerge(tile){
        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile;
    }

    hasTileForMerge(){
        return !!this.linkedTileForMerge;
    }

    canAccept(newTile){
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
    }
    
    mergeTiles(){
        let sum = this.linkedTile.value + this.linkedTileForMerge.value;
        // console.log(sum);
        this.point = sum;
        this.linkedTile.setValue(sum);
        this.linkedTileForMerge.removeFromDOM();
        this.unlinkTileForMerge();

    }

    isEmpty(){
        return !this.linkedTile;
    }
}