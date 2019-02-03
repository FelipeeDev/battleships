function ConsoleInterface (battleShips) {
    let readline = require('readline'),
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    let getUserTarget = function () {
        rl.question('Type target (ie. b6): ', (answer) => {
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
            if ('finished' === result
                && confirm('Congrats! You have sank all the ships! Do you want to play again?')
            ) {
                rl.question('Congrats! You have sank all the ships! Do you want to play again [yes]? ', (answer) => {
                    if ('yes' === answer) {
                        battleShips.run();
                        return;
                    }
                    rl.close();
                });
                return;
            }

            console.log(result);
            getUserTarget();
        }
    }
}

module.exports = ConsoleInterface;