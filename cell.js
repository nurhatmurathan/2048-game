export class Cell{
    constructor(gridElement, row, col){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridElement.append(cell);
        this.y = col;
        this.x = row;
    }
}