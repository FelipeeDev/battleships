function ConsoleInterface (battleShips) {
    let si = process.stdin;
    si.setEncoding('utf-8');
    let getUserTarget = function () {
        console.log('Type target (i.e. b6): ');
        si.on('data', (answer) => {
            try {
                battleShips.selectFieldLiteraly(answer.replace(/(\r\n|\n|\r)/gm, ""));
            } catch (error) {
                console.log(error);
            }
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
                console.log('Congrats! You have sank all the ships in ' + battleShips.getMoves() + ' moves!');
                process.exit();
                return;
            }

            console.log(result);
            getUserTarget();
        }
    }
}

module.exports = ConsoleInterface;