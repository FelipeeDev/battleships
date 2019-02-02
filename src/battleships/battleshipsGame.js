export default function battleShipsApp(ships, cols = 10, rows = 10) {
    let observers = {
            onInit: [],
            onSelect: [],
            onResult: [],
        },
        shuffledFields = [],
        occupiedFields = {},
        moves = 0,
        shipCount = ships.length,
        shipsSank = 0;

    let makeShip = function (len) {
        if (!shuffledFields.length) {
            throw "No more space for ships. Try to reduce the number of ships.";
        }
        let field = shuffledFields.shift(),
            col = field.col,
            row = field.row,
            horizontal = Math.random() >= 0.5,
            obj = {
                len: len,
                hit: 0,
                isSank: function () {
                    return this.hit >= this.len;
                }
            };

        if (occupiedFields[col + '_' + row]
            || (horizontal && col + len > cols)
            || (!horizontal && row + len > rows)
        ) {
            makeShip(len);
            return;
        }


        for (let i = 1; i <= len-1; i++) {
            if ((horizontal && occupiedFields[(col + i) + '_' + row])
                || (!horizontal && occupiedFields[col + '_' + (row + i)])) {
                makeShip(len);
                return;
            }
        }

        occupiedFields[col + '_' + row] = obj;
        for (let i = 1; i <= len-1; i++) {
            if (horizontal) {
                occupiedFields[(col + i) + '_' + row] = obj;
                continue;
            }
            occupiedFields[col + '_' + (row + i)] = obj;
        }
    };

    let init = function() {
        shuffledFields = shuffleFields();
        occupiedFields = {};
        moves = 0;
        shipsSank = 0;
        for (let i in ships) {
            makeShip(ships[i]);
        }
        for (let i in observers.onInit) {
            observers.onInit[i]();
        }
    };

    let shuffleFields = function () {
        let arr = [];

        for (let i = 0; i <= cols - 1; i++) {
            for (let j = 0; j <= rows - 1; j++) {
                arr.splice(Math.floor(Math.random() * (arr.length+1)), 0, {col: i, row:j});
            }
        }

        return arr;
    };

    let gameFinished = function () {
        for (let i in observers.onResult) {
            observers.onResult[i]('finished');
        }
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
            let key = col + '_' + row,
                hit = occupiedFields[key];

            for (let i in observers.onInit) {
                observers.onSelect[i](col, row, hit);
            }

            moves++;


            if (!hit) {
                for (let i in observers.onResult) {
                    observers.onResult[i]('missed');
                }
                return;
            }

            occupiedFields[key].hit++;

            if (occupiedFields[key].isSank()) {
                for (let i in observers.onResult) {
                    observers.onResult[i]('sank');
                }
                shipsSank++;
                if (shipsSank >= shipCount) {
                    gameFinished();
                }
                return;
            }

            for (let i in observers.onResult) {
                observers.onResult[i]('hit');
            }
        }
    }
};
