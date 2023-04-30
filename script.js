import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const game_board = document.getElementById("game-board");

var board_area = 5;
const grid = new Grid(game_board, board_area);
grid.getRandomEmptyCell().linkTile(new Tile(game_board));

setupInputOnce();


function setupInputOnce() {
    window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            await moveUp();
            break;

        case "ArrowDown":
            await moveDown();
            break;

        case "ArrowRight":
            await moveRight();
            break;

        case "ArrowLeft":
            await moveLeft();
            break;

        default:
            setupInputOnce();
            return;
    }

    const newTile = new Tile(game_board);
    grid.getRandomEmptyCell().linkTile(newTile);

    setupInputOnce();

}


async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupCells) {
    // console.log(groupCells);
    const promises = [];
    groupCells.forEach(group => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    });
}

function slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) {
            continue;
        }

        const cellWithTile = group[i];

        let targetCell, j = i - 1;

        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j--];
        }

        if (!targetCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unlinkTile();
    }
}
