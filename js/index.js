"use strict"

/** Игровое поле, контейнер для кнопок
 * @type {Element} */
const board = document.querySelector('.board');

/** Кнопка "Начать игру"
 * @type {Element} */
const startButton = document.querySelector('.start-button');

/** Заголовок с именем текущего игрока / выигравшего игрока
 * @type {Element} */
const playerTitle = document.querySelector('.current-player');

/** Счет игрока
 * @type {Element} */
const userScore = document.querySelector('.user-score');

// Счет компьютера
const compScore = document.querySelector('.comp-score');

/** Игроки
 * @type {[{name: string, value: string},{name: string, value: string}]}
 * name - имя игрока, value - значение поля, пишется в массив, строит класс, который отрисовывает нужную фишку Х или О */
const players = [
    {
        name: 'Игрок',
        value: 'x'
    },
    {
        name: 'Компьютер',
        value: 'o'
    },
]

//
/** Массив для игрового поля выглядит так:
 *  let boardArray = [0, 0, 0,
 *                    0, 0, 0,
 *                    0, 0, 0];
 */

/** Выигрышные комбинации.
 * Если в игровом поле элементы с этими
 * индексами имеют одинаковое значение,
 * то игрок выиграл
 * @type {number[][]}
 */
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

/** Массивы для алгоритма ходов компьютера
 * @type {string[]} */
const possibleCombinations = [
    'oo0',
    'o0o',
    '0oo',
    'o00',
    '0o0',
    '00o'
]

const userCombinations = [
    'xx0',
    'x0x',
    '0xx',
    'x00',
    '0x0',
    '00x'
]

/** Очки
 * @type {number[]} */
let score = [0, 0];

/** Показать очки
 * @param array
 * */
function showScore(array) {
    userScore.textContent = array[0].toString();
    compScore.textContent = array[1].toString();
}

/** Показываем нулевые очки по загрузке страницы */
showScore(score);

/** Показать ход игрока
 * @param num - число */
function showCurrentPlayer(num) {
    playerTitle.textContent = "Сейчас ход игрока: " + players[num].name;
}

/** Показать победителя
 * @param num
 */
function showWinner(num) {
    playerTitle.textContent = "Выиграл " + players[num].name;
}

/** Новая игра */
function newGame() {
    /** Возвращаем имени пользователя начальный цвет, убираем красный цвет после выигрыша */
    playerTitle.classList.remove('red');

    /** Даем кнопке название Новая игра, после выигрыша, когда мы ее поменяли на Начать заново
     * @type {string} */
    startButton.textContent = "Новая игра";

    /** Блокируем кнопку, чтобы на нее нельзя было нажать и прервать игру
     * @type {boolean} */
    startButton.disabled = true;

    /** Переменная для хранения индекса текущего игрока
     * @type {number} 0 - игрок, 1 - компьютер */
    let currentPlayer = 0;

    /** Массив игрового поля с начальными пустыми значениями
     * @type {number[]} */
    let boardArray = [0, 0, 0,
        0, 0, 0,
        0, 0, 0];

    /** Заполняем игровое поле значениями из массива boardArray,
     *  на данный момент поле пустое */
    fillBoard(boardArray, 0);

    /** Выводим на табло имя игрока, который делает ход */
    showCurrentPlayer(currentPlayer);

    function makeTurn(evt) {
        if (evt.target.classList.contains('field-0')) {
            /** записываем значение нажатой фишки в массив */
            const fielditems = board.querySelectorAll('.field');
            /** получаем индекс нажатой фишки */
            let index = Object.keys(fielditems).find(key => fielditems[key] === evt.target);
            /** пишем в массив */
            boardArray[index] = players[currentPlayer].value;
            fillBoard(boardArray, 0);
            /** проверяем выигрыш. работает, хоть и ошибка */
            if (!winCheck(boardArray)) {
                fillBoard(boardArray, 1);
                currentPlayer++;
                showCurrentPlayer(currentPlayer);
                setTimeout(compTurn, Math.floor(Math.random() * (3000 - 350)) + 350, boardArray);
            }
        }
    }

    function winCheck(array) {
        let i = null;
        winCombinations.forEach((combination) => {
            if ((array[combination[0]].toString() + array[combination[1]].toString() + array[combination[2]].toString()) === "xxx" || (array[combination[0]].toString() + array[combination[1]].toString() + array[combination[2]].toString()) === "ooo") {
                showWinner(currentPlayer);
                score[currentPlayer] += 1;
                showScore(score);
                playerTitle.classList.add('red');
                startButton.disabled = false;
                startButton.textContent = "Начать заново";
                fillBoard(boardArray, 1);
                i = 1;
            }
        })
        if (!i && (!(boardArray.includes(0)))) {
            /** проверка наличия ходов - пустых полей, если их нет - ничья */
            playerTitle.textContent = "Ничья!";
            playerTitle.classList.add('red');
            startButton.disabled = false;
            startButton.textContent = "Начать заново";
            fillBoard(boardArray, 1);
            i = 2;
        }
        return i;
    }

    function compTurn(array) {
        let compTurns = [];
        let userTurns = [];
        let randTurn = [];


        winCombinations.forEach((combination) => {
            for (let i = 0; i < possibleCombinations.length - 3; i++) {
                if ((array[combination[0]].toString() + array[combination[1]].toString() + array[combination[2]].toString()) === possibleCombinations[i]) {
                    compTurns.push(combination)
                }
            }
        })
        if (compTurns.length > 0) {
            /** занять свободную ячейку из массива */
            compTurns.forEach((combination) => {
                combination.forEach((item) => {
                    if (boardArray[item] === 0 && !randTurn.includes(item)) {
                        randTurn.push(item);
                    }
                })
            })
            makecompTurn(randTurn);
        } else if (compTurns.length === 0) {
            winCombinations.forEach((combination) => {
                for (let i = 3; i < userCombinations.length; i++) {
                    if ((array[combination[0]].toString() + array[combination[1]].toString() + array[combination[2]].toString()) === userCombinations[i]) {
                        compTurns.push(combination)
                    }
                }
            })
        }
        /** занять свободную ячейку из массива */
        if (compTurns.length > 0) {
            compTurns.forEach((combination) => {
                combination.forEach((item) => {
                    if (boardArray[item] === 0 && !randTurn.includes(item)) {
                        randTurn.push(item);
                    }
                })
            })
            makecompTurn(randTurn);
        }
        /** если нет вариантов */
        if (compTurns.length === 0) {
            winCombinations.forEach((combination) => {
                for (let i = 0; i < userCombinations.length; i++) {
                    if ((array[combination[0]].toString() + array[combination[1]].toString() + array[combination[2]].toString()) === userCombinations[i]) {
                        userTurns.push(combination)
                    }
                }
            })
        }
        /** занять свободную ячейку из массива */
        if (userTurns.length > 0) {
            userTurns.forEach((combination) => {
                combination.forEach((item) => {
                    if (boardArray[item] === 0 && !randTurn.includes(item)) {
                        randTurn.push(item);
                    }
                })
            })
            makecompTurn(randTurn);
        }

        function makecompTurn(array) {
            /** пишем в массив */
            let rand = array[Math.floor(Math.random() * array.length)];
            boardArray[rand] = players[currentPlayer].value;
            fillBoard(boardArray, 0);
        }

        /** проверяем выигрыш */
        if (!winCheck(boardArray)) {
            currentPlayer--;
            showCurrentPlayer(currentPlayer);
            compTurns = [];
            userTurns = [];
            randTurn = [];
        }
    }

    function fillBoard(array, mode) {
        board.innerHTML = "";
        array.forEach(function (item) {
            board.insertAdjacentHTML('beforeend', `<button class="field field-${item}"></button>`);
        })
        switch (mode) {
            case 0:
                board.querySelectorAll('.field').forEach((item) => {
                    item.addEventListener('click', function (evt) {
                        makeTurn(evt);
                    })
                })
                break
            case 1:
                break
        }
    }
}

/** просто отрисовка пустого поля при загрузке */
document.addEventListener('DOMContentLoaded', function () {
    let boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    boardArray.forEach(function (item) {
        board.insertAdjacentHTML('beforeend', `<li class="field field-${item}"></li>`)
    })
    startButton.addEventListener('click', newGame);
});
