let canvas = $('#game_field').get(0);

let containers = [
    $('#menu_choose_player').get(0),
    $('#menu_choose_buttons').get(0),
    $('#menu_start_game').get(0),
    canvas,
    $('#menu_end_game').get(0)
];

let ctx = canvas.getContext("2d");
let numberOfSnakes;
let constantSnakes;
let snakes;
let p;
let SPEED = 15;
let currentSnakeId = 0;

$(document).ready(function () {
    changeScreen(0);
});

$(document).on('keypress', function (event) {
    for (let snake of snakes) {
        if (event.which === snake.leftKey) {
            snake.turnLeft();
        } else if (event.which === snake.rightKey) {
            snake.turnRight();
        }
    }
});

function draw() {
    ctx.beginPath();
    let newSnakes = [];
    for (let snake of snakes) {
        if (snake.move(ctx)) {
            snake.remove();
        } else {
            newSnakes.push(snake);
        }
    }
    if (newSnakes.length === 1) {
        initGameOver(newSnakes[0].id)
    } else if (newSnakes.length === 0) {
        initGameOver(-1)
    } else {
        snakes = newSnakes;
    }
    ctx.closePath();
}

function getReadyForGame() {
    changeScreen(3);
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    snakes = constantSnakes.slice();
    for (let snake of snakes) {
        snake.refresh();
    }
    p = setInterval(draw, SPEED);
}

function numberOfPlayersChosed(numberOfPlayers) {
    numberOfSnakes = numberOfPlayers;
    constantSnakes = new Array(numberOfPlayers);
    changeScreen(1);
    initChooseScreen(0);
}

function initChooseScreen() {
    let leftCharElement = $("#left_char");
    let rightCharElement = $("#right_char");

    $("#choose_buttons_title").text("Choose button for player " + currentSnakeId);

    leftCharElement.text("");
    rightCharElement.text("");

    leftCharElement.click(function () {
        leftCharElement.attr("tabindex", -1).focus();
    });

    rightCharElement.click(function () {
        rightCharElement.attr("tabindex", -1).focus();
    });

    leftCharElement.keypress(function (event) {
        leftCharElement.text(String.fromCharCode(event.which));
        leftCharElement.blur();
    });

    rightCharElement.keypress(function (event) {
        rightCharElement.text(String.fromCharCode(event.which));
        rightCharElement.blur();
    });

    $("#key_chosed_button").click(function () {
        keyChosed()
    })
}

function keyChosed() {
    let leftCharElement = $("#left_char");
    let rightCharElement = $("#right_char");

    if (leftCharElement.text() === "" || rightCharElement.text() === "") {
        alert("You didn't choose key");
    } else {
        constantSnakes[currentSnakeId] = new Snake(currentSnakeId, canvas.width, leftCharElement.text().charCodeAt(0), rightCharElement.text().charCodeAt(0));
        if (currentSnakeId + 1 === numberOfSnakes) {
            changeScreen(2)
        } else {
            currentSnakeId++;
            initChooseScreen();
        }
    }
}

function initGameOver(winnerId) {
    changeScreen(4);
    clearInterval(p);
    snakes = [];
    if (winnerId === -1) {
        $("#winner_text").text("Draw");
    } else {
        $("#winner_text").text("Player " + winnerId + " win the game");
    }
}

function changeScreen(numberOfScreen) {
    let i = 0;
    for (const container in containers) {
        if (i === numberOfScreen) {
            containers[container].style.display = 'flex';
        } else {
            containers[container].style.display = 'none';
        }
        i++;
    }

}

