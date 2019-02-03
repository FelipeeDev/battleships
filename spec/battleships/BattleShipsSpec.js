describe('BattleShips', function () {
    let battleShipsApp = require('../../src/battleships/BattleshipsGame'),
        ships = [5, 4, 4],
        cols = 10,
        rows = 10,
        battleShips;

    beforeEach(function() {
        battleShips = battleShipsApp(ships, cols, rows);
    });

    it('register onInit observer', function () {
        battleShips.onInit(function () {});

        expect(battleShips.onInit(function () {})).toEqual(battleShips);
    });

    it('register onSelect observer', function () {
        let result = battleShips.onSelect(function () {});
        battleShips.run();

        expect(result).toEqual(battleShips);
    });

    it('register onResult observer', function () {
        battleShips.onResult(function () {});

        expect(battleShips.onInit(function () {})).toEqual(battleShips);
    });

    it('register onInit observer', function () {
        battleShips.onInit(function () {});

        expect(battleShips.onInit(function () {})).toEqual(battleShips);
    });
});