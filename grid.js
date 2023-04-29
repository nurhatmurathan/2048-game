import { Cell } from "./cell.js";

export class Grid {
    constructor(gridElement, size) {
        this.cells = [];
        const GRID_SIZE = size;
        console.log(this.GRID_SIZE);
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                this.cells.push(new Cell(gridElement, row, col));
            }
        }
    }
}