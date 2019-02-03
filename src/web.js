import battleShipsApp from "./battleships/battleshipsGame";
import htmlRenderer from "./battleships/htmlRenderer";

const BOARD_COLS = 10;
const BOARD_ROWS = 10;
const SHIPS = [5, 4, 4];

let battleShips = battleShipsApp(SHIPS, BOARD_COLS, BOARD_ROWS),
    renderer = htmlRenderer(battleShips, BOARD_COLS, BOARD_ROWS);

battleShips.onInit(function () {
    renderer.render();
}).onSelect(function (col, row, hit) {
    renderer.clearOnClick(col, row, hit);
}).onResult(function (result) {
    if ('finished' === result
        && confirm('Congrats! You have sank all the ships! Do you want to play again?')
    ) {
        battleShips.run();
        return;
    }
    renderer.showMessage(result);
}).run();

