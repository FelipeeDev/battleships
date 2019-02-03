function ShipService (boardService) {
    let createShip = function (len) {
        return {
            len: len,
            hit: 0,
            isSank: function () {
                return this.hit >= this.len;
            }
        };
    };

    return {
        makeShip: function (len) {
            let field = boardService.shiftField(),
                col = field.col,
                row = field.row,
                horizontal = Math.random() >= 0.5,
                ship = createShip(len);

            if (boardService.isOccupied(col, row)
                || (horizontal && col + len > boardService.colsCount())
                || (!horizontal && row + len > boardService.rowsCount())
            ) {
                return this.makeShip(len);
            }

            for (let i = 1; i <= len-1; i++) {
                if ((horizontal && boardService.isOccupied(col + i, row))
                    || (!horizontal && boardService.isOccupied(col, row + i))) {
                    return this.makeShip(len);
                }
            }

            boardService.occupy(col, row, ship);
            for (let i = 1; i <= len-1; i++) {
                if (horizontal) {
                    boardService.occupy(col + i, row, ship);
                    continue;
                }
                boardService.occupy(col, row + i, ship);
            }

            return ship;
        },
        getBoardService() {
            return boardService;
        }
    };
}

module.exports = ShipService;