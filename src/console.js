let battleShipsApp = require("./battleships/BattleshipsGame"),
    shipService = require("./battleships/ShipService"),
    boardService = require("./battleships/BoardService"),
    consoleInterface = require("./battleships/ConsoleInterface");

const BOARD_COLS = 10;
const BOARD_ROWS = 10;
const SHIPS = [5, 4, 4];

let boardServiceInstance = boardService(BOARD_COLS, BOARD_ROWS),
    shipServiceInstance = shipService(boardServiceInstance),
    battleShips = battleShipsApp(shipServiceInstance, SHIPS),
    console = consoleInterface(battleShips);

battleShips.onInit(function () {
    console.newGame();
}).onResult(function (result) {
    console.resolveResult(result);
}).run();

