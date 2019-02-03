/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
                let colCharCode = colChar.toUpperCase().charCodeAt(0);
                for (let i = 0; i <= cols - 1; i++) {
                    if (colCharCode === letterCode) {
                        col = i;
                        break;
                    }
                    letterCode++;
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function HtmlRenderer(battleShips) {
    const TARGET = 'target';
    const TARGET_ACTION = 'target-action';

    let addEventHandlers = function () {
        let elements = document.getElementsByClassName('active');
        for (let i = 0; i <= 99; i++) {
            let td = elements.item(i);
            td.onclick = function () {
                battleShips.selectField(td.getAttribute('data-col'), td.getAttribute('data-row'));
            };
        }
    };

    let fireAction = function () {
        try {
            battleShips.selectFieldLiteraly(document.getElementById(TARGET).value);
        } catch (exception) {
            alert(exception);
        }
    };

    let renderBoard = function () {
        let gameContainer = document.getElementById('game-container'),
            table = document.createElement('table'),
            tr = document.createElement('tr'),
            th = document.createElement('th'),
            firstLetter = 'A'.charCodeAt(0),
            cols = battleShips.getBoardService().colsCount();

        table.setAttribute('class', 'bordered');
        tr.append(th);

        for (let i = 0; i <= cols - 1; i++) {
            let th = document.createElement('th');
            th.innerText = String.fromCharCode(firstLetter++);
            tr.append(th);
        }
        table.append(tr);

        for (let i = 0; i <= battleShips.getBoardService().rowsCount() - 1; i++) {
            let tr = document.createElement('tr'),
                th = document.createElement('th');
            th.innerText = i+1;
            tr.append(th);

            for (let j = 0; j <= cols - 1; j++) {
                let td = document.createElement('td');
                td.setAttribute('id', j + '_' + i);
                td.setAttribute('class', 'active');
                td.setAttribute('data-row', i);
                td.setAttribute('data-col', j);
                tr.append(td);
            }
            table.append(tr);
        }

        gameContainer.innerHTML = table.outerHTML;
        addEventHandlers();
    };

    let renderAction = function() {
        let container = document.getElementById('action-container'),
            label = document.createElement('label'),
            input = document.createElement('input'),
            button = document.createElement('button');

        label.setAttribute('for', TARGET);
        input.setAttribute('id', TARGET);
        input.setAttribute('placeholder', 'i.e. type: b6');
        button.setAttribute('id', TARGET_ACTION);
        button.setAttribute('type', 'button');
        button.innerText = 'Strike';

        container.innerHTML = label.outerHTML;
        container.append(input);
        container.append(button);

        document.getElementById(TARGET_ACTION).onclick = fireAction;
    };

    return {
        showMessage: function (message) {
            document.getElementById('message-container').innerText = message;
        },
        endGameConfirmation() {
            if (confirm('Congrats! You have sank all the ships in ' + battleShips.getMoves() + ' moves! Do you want to play again?')) {
                battleShips.run();
            }
        },
        clearOnClick: function (col, row, hit) {
            let td = document.getElementById(col + '_' + row);
            td.setAttribute('onclick', '');
            if (hit) {
                td.setAttribute('class', 'hit');
                return;
            }
            td.setAttribute('class', 'missed');
        },
        render: function () {
            renderBoard();
            renderAction();
        }
    };
}

module.exports = HtmlRenderer;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _battleships_BattleshipsGame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _battleships_BattleshipsGame__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_battleships_BattleshipsGame__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _battleships_ShipService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _battleships_ShipService__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_battleships_ShipService__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _battleships_BoardService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _battleships_BoardService__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_battleships_BoardService__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _battleships_HtmlRenderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _battleships_HtmlRenderer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_battleships_HtmlRenderer__WEBPACK_IMPORTED_MODULE_3__);





const BOARD_COLS = 10;
const BOARD_ROWS = 10;
const SHIPS = [5, 4, 4];

let boardServiceInstance = _battleships_BoardService__WEBPACK_IMPORTED_MODULE_2___default()(BOARD_COLS, BOARD_ROWS),
    shipServiceInstance = _battleships_ShipService__WEBPACK_IMPORTED_MODULE_1___default()(boardServiceInstance),
    battleShips = _battleships_BattleshipsGame__WEBPACK_IMPORTED_MODULE_0___default()(shipServiceInstance, SHIPS),
    renderer = _battleships_HtmlRenderer__WEBPACK_IMPORTED_MODULE_3___default()(battleShips);

battleShips.onInit(function () {
    renderer.render();
}).onSelect(function (col, row, hit) {
    renderer.clearOnClick(col, row, hit);
}).onResult(function (result) {
    if ('finished' === result) {
        renderer.endGameConfirmation();
    }

    renderer.showMessage(result);
}).run();



/***/ })
/******/ ]);