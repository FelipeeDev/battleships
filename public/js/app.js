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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/battleships/battleshipsGame.js
function battleShipsApp(ships, cols = 10, rows = 10) {
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

// CONCATENATED MODULE: ./src/battleships/htmlRenderer.js
function htmlRenderer(battleShips, cols, rows) {
    let addEventHandlers = function () {
        let elements = document.getElementsByClassName('active');
        for (let i = 0; i <= 99; i++) {
            let td = elements.item(i);
            td.onclick = function () {
                battleShips.selectField(td.getAttribute('data-col'), td.getAttribute('data-row'));
            };
        }
    };

    return {
        showMessage: function (message) {
            document.getElementById('message-container').innerText = message;
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
            let gameContainer = document.getElementById('game-container'),
                table = document.createElement('table'),
                tr = document.createElement('tr'),
                th = document.createElement('th'),
                firstLetter = 'A'.charCodeAt(0);

            table.setAttribute('class', 'bordered');
            tr.append(th);

            for (let i = 0; i <= cols - 1; i++) {
                let th = document.createElement('th');
                th.innerText = String.fromCharCode(firstLetter++);
                tr.append(th);
            }
            table.append(tr);

            for (let i = 0; i <= rows - 1; i++) {
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
        }
    };
};
// CONCATENATED MODULE: ./src/web.js



const BOARD_COLS = 10;
const BOARD_ROWS = 10;

let battleShips = battleShipsApp([5, 4, 4], BOARD_COLS, BOARD_ROWS),
    renderer = htmlRenderer(battleShips, BOARD_COLS, BOARD_ROWS);

battleShips.onInit(function () {
    renderer.render();
}).onSelect(function (col, row, hit) {
    renderer.clearOnClick(col, row, hit);
}).onResult(function (result) {
    if ('finished' === result
        && confirm('Congrats! You have sank all the ships! Do you want to play again?')
    ) {
        battleShips.run();
        return;
    }
    renderer.showMessage(result);
}).run();



/***/ })
/******/ ]);