const
    COLS_COUNT = 10,
    ROWS_COUNT = 10,
    COL = 5,
    ROW = 6,
    SHIP = {len: 5};

describe('BoardService', function () {
    let boardService = require("../../src/battleships/BoardService"),
        boardServiceInstance;

    beforeEach(function() {
        boardServiceInstance = boardService(COLS_COUNT, ROWS_COUNT);
        boardServiceInstance.reset();
    });

    it('occupy set and get', function () {
        boardServiceInstance.occupy(COL, ROW, SHIP);

        expect(boardServiceInstance.get(COL, ROW)).toEqual(SHIP);
    });

    it('is occupied', function () {
        boardServiceInstance.occupy(COL, ROW, SHIP);

        expect(boardServiceInstance.isOccupied(COL, ROW)).toEqual(true);
    });

    it('is not occupied', function () {
        expect(boardServiceInstance.isOccupied(COL, ROW)).toEqual(false);
    });

    it('columns count', function () {
        expect(boardServiceInstance.colsCount()).toEqual(COLS_COUNT);
    });

    it('shift field', function () {
        boardServiceInstance = boardService(1, 1);
        boardServiceInstance.reset();

        let field = boardServiceInstance.shiftField();
        expect(field.col).toEqual(jasmine.any(Number));
        expect(field.row).toEqual(jasmine.any(Number));

        expect(function () { boardServiceInstance.shiftField() }).toThrow();
    });
});
