const
    COLS_COUNT = 10,
    ROWS_COUNT = 10,
    LEN = 5;

describe('BoardService', function () {
    let boardService = require("../../src/battleships/BoardService"),
        shipService = require("../../src/battleships/ShipService"),
        boardServiceInstance,
        shipServiceInstance;

    beforeEach(function() {
        boardServiceInstance = boardService(COLS_COUNT, ROWS_COUNT);
        boardServiceInstance.reset();
        shipServiceInstance = shipService(boardServiceInstance);
    });

    it('get board service', function () {
        expect(shipServiceInstance.getBoardService()).toEqual(boardServiceInstance);
    });

    it('make ship', function () {
        ship = shipServiceInstance.makeShip(LEN);

        expect(ship.len).toEqual(LEN);
        expect(ship.hit).toEqual(0);
    });

    it('make ship thrown exception', function () {
        expect(function () {shipServiceInstance.makeShip(LEN + 10)}).toThrow();
    });
});
