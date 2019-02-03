function BoardService(cols, rows) {
    let fields = [],
        occupied = {};

    let shuffleFields = function () {
        let arr = [];

        for (let i = 0; i <= cols - 1; i++) {
            for (let j = 0; j <= rows - 1; j++) {
                arr.splice(Math.floor(Math.random() * (arr.length+1)), 0, {col: i, row:j});
            }
        }

        return arr;
    };

    return {
        reset() {
            fields = shuffleFields();
            occupied = {};
        },
        occupy: function (col, row, ship) {
            occupied[col + '_' + row] = ship;
        },
        isOccupied: function (col, row) {
            return Boolean(occupied[col + '_' + row]);
        },
        get: function (col, row) {
            return occupied[col + '_' + row];
        },
        colsCount: function () {
            return cols;
        },
        rowsCount: function () {
            return rows;
        },
        shiftField: function () {
            if (!fields.length) {
                throw "No more space for ships. Try to reduce the number of ships.";
            }
            return fields.shift();
        }
    }
}

module.exports = BoardService;