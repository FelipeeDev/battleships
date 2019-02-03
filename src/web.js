import battleShipsApp from "./battleships/BattleshipsGame";
import shipService from "./battleships/ShipService";
import boardService from "./battleships/BoardService";
import htmlRenderer from "./battleships/HtmlRenderer";

const BOARD_COLS = 10;
const BOARD_ROWS = 10;
const SHIPS = [5, 4, 4];

let boardServiceInstance = boardService(BOARD_COLS, BOARD_ROWS),
    shipServiceInstance = shipService(boardServiceInstance),
    battleShips = battleShipsApp(shipServiceInstance, SHIPS),
    renderer = htmlRenderer(battleShips);

battleShips.onInit(function () {
    renderer.render();
}).onSelect(function (col, row, hit) {
    renderer.clearOnClick(col, row, hit);
}).onResult(function (result) {
    if ('finished' === result) {
        renderer.endGameConfirmation();
    }

    renderer.showMessage(result);
}).run();

