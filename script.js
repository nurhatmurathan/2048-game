import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const game_board = document.getElementById("game-board");

const searchParams = new URLSearchParams(window.location.search);
const areaSize = searchParams.get("area_size");

const currentScoreElement = document.getElementById("current-score");
const highScoreElement = document.getElementById("best-score");

let currentScore = 0;
let highScore = localStorage.getItem("bestScore" + parseInt(areaSize)) || 0;
highScoreElement.innerHTML = highScore;

const grid = new Grid(game_board, areaSize);
grid.getRandomEmptyCell().linkTile(new Tile(game_board));

const bot_chek = document.getElementById('bot');
var bot_active = false;



setupInputOnce();

function updateScore(score) {
    currentScore += score;
    currentScoreElement.innerHTML = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("bestScore" + parseInt(areaSize), highScore);
        highScoreElement.innerHTML = highScore;
    }
}

function setupInputOnce() {
    if (bot_active) {
        var bot_way;
        let random = Math.random();
        if (random < 0.25) bot_way = "ArrowUp";
        else if (random < 0.5) bot_way = "ArrowDown";
        else if (random < 0.75) bot_way = "ArrowRight";
        else bot_way = "ArrowLeft";
        // console.log("bot");
        setTimeout(function () {
            handleInput(new KeyboardEvent('keydown', { key: bot_way }));
        }, 1000);
    } else {
        window.addEventListener("keydown", handleInput, { once: true });
    }
}

bot_chek.addEventListener('change', function () {
    if (bot_chek.checked) {
        bot_active = true;
        setupInputOnce();
    } else {
        bot_active = false;
    }
});

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;

        case "ArrowDown":
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;

        case "ArrowRight":
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight();
            break;

        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;

        default:
            setupInputOnce();
            return;
    }

    const newTile = new Tile(game_board);
    grid.getRandomEmptyCell().linkTile(newTile);

    if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
        await newTile.waitForAnimationEnd();
        alert("Try adain!");

        location.reload();
    }

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
    let score = 0;
    groupCells.forEach(group => {
        group.forEach(cell => {
            score += cell.point;
            cell.point = 0;
        });
    });
    updateScore(score);
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


function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow);
}

function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow);
}

function canMove(groupCells) {
    return groupCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index == 0 || cell.isEmpty()) return false;

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}