import { Cell } from "./cell.js";

var GRID_SIZE;

export class Grid {
    constructor(gridElement, size) {
        this.cells = [];
        this.GRID_SIZE = size;
        gridElement.style.setProperty("--cell-count", this.GRID_SIZE);
        console.log(this.GRID_SIZE);
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                this.cells.push(new Cell(gridElement, row, col));
            }
        }

        this.cellsGroupedByColumn = this.groupCellsByColumn();
    }

    getRandomEmptyCell(){
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const idx = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[idx];
    }

    groupCellsByColumn(){
        return this.cells.reduce((groupCells, cell) => {
            groupCells[cell.x] = groupCells[cell.x] || [];
            groupCells[cell.x][cell.y] = cell;
            return groupCells;

        }, []);
    }
}