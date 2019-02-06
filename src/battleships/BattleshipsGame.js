function BattleShipsApp(shipService, ships) {
    let boardService = shipService.getBoardService(),
        observers = {
            onInit: [],
            onSelect: [],
            onResult: [],
        },
        fieldsSelected = {},
        moves = 0,
        shipCount = ships.length,
        shipsSank = 0;

    let init = function() {
        moves = 0;
        shipsSank = 0;
        fieldsSelected = {};
        boardService.reset();
        for (let i in ships) {
            shipService.makeShip(ships[i]);
        }
        triggerEvent('onInit')
    };

    let triggerEvent = function (event, ...args) {
        for (let i in observers[event]) {
            observers[event][i](...args);
        }
    };

    let shotMissed = function () {
        triggerEvent('onResult', 'missed');
    };

    let shipHit = function () {
        triggerEvent('onResult', 'hit');
    };

    let shipSank = function () {
        triggerEvent('onResult', 'sank');
    };

    let gameFinished = function () {
        triggerEvent('onResult', 'finished');
    };

    let registerObserver = function (event, observer) {
        if (!event in observers) {
            throw "There is no event called: " + event;
        }
        if (typeof observer !== 'function') {
            throw "Observer has to be callable.";
        }

        observers[event].push(observer);
    };

    return {
        run: function () {
            init();
        },
        onInit: function (observer) {
            registerObserver('onInit', observer);
            return this;
        },
        onSelect: function (observer) {
            registerObserver('onSelect', observer);
            return this;
        },
        onResult: function (observer) {
            registerObserver('onResult', observer);
            return this;
        },
        selectField: function (col, row) {
            let hit = boardService.isOccupied(col, row);

            triggerEvent('onSelect', col, row, hit);

            if (fieldsSelected[col + '_' + row]) {
                return;
            }

            fieldsSelected[col + '_' + row] = true;
            moves++;

            if (!hit) {
                shotMissed();
                return;
            }
            let ship = boardService.get(col, row);

            ship.hit++;

            if (ship.isSank()) {
                shipSank();
                shipsSank++;
                if (shipsSank >= shipCount) {
                    gameFinished();
                }
                return;
            }

            shipHit();
        },
        selectFieldLiteraly(value) {
            let colChar = value[0],
                col = null,
                row = parseInt(value.slice(1)),
                cols = boardService.colsCount(),
                letterCode = 'A'.charCodeAt(0);

            if (colChar) {
                try {
                    let colCharCode = colChar.toUpperCase().charCodeAt(0);
                    for (let i = 0; i <= cols - 1; i++) {
                        if (colCharCode === letterCode) {
                            col = i;
                            break;
                        }
                        letterCode++;
                    }
                } catch (error) {
                }
            }

            if (col !== null && col >= 0 && col <= cols - 1
                && !isNaN(row) && row >= 1 && row - 1 <= boardService.rowsCount() - 1
            ) {
                this.selectField(col, row - 1);

                return
            }

            throw "There is no field: " + value + ". Try again!";
        },
        getMoves() {
            return moves;
        },
        getBoardService() {
            return boardService;
        }
    }
}

module.exports = BattleShipsApp;