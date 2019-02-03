function ConsoleInterface (battleShips) {
    let readline = require('readline'),
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    let getUserTarget = function () {
        rl.question('Type target (i.e. b6): ', (answer) => {
            battleShips.selectFieldLiteraly(answer);
        });
    };

    return {
        newGame: function () {
            console.log("=============");
            console.log("New game");
            getUserTarget();
        },
        resolveResult: function (result) {
            if ('finished' === result ) {
                rl.close();
                console.log('Congrats! You have sank all the ships in ' + battleShips.getMoves() + ' moves!');
                return;
            }

            console.log(result);
            getUserTarget();
        }
    }
}

module.exports = ConsoleInterface;