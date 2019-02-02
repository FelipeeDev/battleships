export default function htmlRenderer(battleShips, cols, rows) {
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