import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const game_board = document.getElementById("game-board");

var board_area = 4;
const grid = new Grid(game_board, board_area);
grid.getRandomEmptyCell().linkTile(new Tile(game_board));
grid.getRandomEmptyCell().linkTile(new Tile(game_board));
