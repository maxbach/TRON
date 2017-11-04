let canvas = $('#game_field').get(0);

let containers = [
    $('#menu_choose_player').get(0),
    $('#menu_choose_rounds').get(0),
    $('#menu_choose_buttons').get(0),
    $('#menu_start_game').get(0),
    canvas,
    $('#menu_end_game').get(0)
];

let ctx = canvas.getContext("2d");

let numberOfSnakes;
let numberOfRounds;
let constantSnakes;

let scores;
let currentRound;
let currentScore;

let snakes;
let p;
let SPEED = 20;
let currentSnakeId;

$(document).ready(function () {
    changeScreen(0);
    initListeners();
    $('#game_container').width($('#game_container').height());
    $(window).resize(function () {
        $('#game_container').width($('#game_container').height())
    })
});

function initListeners() {
    let leftCharElement = $("#left_char");
    let rightCharElement = $("#right_char");

    $(document).on('keypress', function (event) {
        if (typeof snakes !== 'undefined' && snakes.length > 0) {
            for (let snake of snakes) {
                if (event.which === snake.leftKey) {
                    snake.turnLeft();
                } else if (event.which === snake.rightKey) {
                    snake.turnRight();
                }
            }
        }
    });

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

function numberOfPlayersChosed(numberOfPlayers) {
    numberOfSnakes = numberOfPlayers;
    constantSnakes = new Array(numberOfPlayers);
    changeScreen(1);
}

function numberOfRoundsChosed(number) {
    numberOfRounds = number;
    currentSnakeId = 0;
    initChooseScreen();
    changeScreen(2);
}

function initChooseScreen() {
    let leftCharElement = $("#left_char");
    let rightCharElement = $("#right_char");

    $("#choose_buttons_title").text("Player " + Snake.getNameById(currentSnakeId));

    leftCharElement.text("");
    rightCharElement.text("");
}

function keyChosed() {
    let leftCharElement = $("#left_char");
    let rightCharElement = $("#right_char");

    if (leftCharElement.text() === "" || rightCharElement.text() === "") {
        alert("You didn't choose key");
    } else {
        constantSnakes[currentSnakeId] = new Snake(currentSnakeId, canvas.width, leftCharElement.text().charCodeAt(0), rightCharElement.text().charCodeAt(0));
        if (currentSnakeId + 1 === numberOfSnakes) {
            changeScreen(3)
        } else {
            currentSnakeId++;
            initChooseScreen();
        }
    }
}

function initNewGame() {
    currentRound = 0;
    scores = [];
    for (i = 0; i < numberOfSnakes; i++) {
        scores.push(0)
    }
    initNewRound()
}

function initNewRound() {
    currentScore = 1;
    currentRound++;
    changeScreen(4);
    let width = $('#game_container').width();
    ctx.canvas.width = width;
    ctx.canvas.height = width;
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    snakes = constantSnakes.slice();
    for (let snake of snakes) {
        snake.refresh(width);
    }
    p = setInterval(draw, SPEED);
}

function draw() {
    ctx.beginPath();
    let newSnakes = [];
    let deathSnakes = 0;
    for (let snake of snakes) {
        if (snake.move(ctx)) {
            deathSnakes++;
            scores[snake.id] += currentScore;
            snake.remove();
        } else {
            newSnakes.push(snake);
        }
    }
    currentScore += deathSnakes;
    if (newSnakes.length <= 1) {
        if (newSnakes.length === 1) {
            scores[newSnakes[0].id] += currentScore;
        }
        roundOver();
    } else {
        snakes = newSnakes;
    }
    ctx.closePath();
}

function roundOver(winnerId) {
    changeScreen(5);
    if (currentRound === numberOfRounds) {
        $("#next_round_button").css("display", "none");
        $("#again_button").css("display", "block");
    } else {
        $("#next_round_button").css("display", "block");
        $("#again_button").css("display", "none");
    }
    clearInterval(p);
    snakes = [];
    let text = "";
    for (i = 0; i < scores.length; i++) {
        text = text + Snake.getNameById(i) + " - " + scores[i] + "\n";
    }
    $("#results").text(text);
}

function changeScreen(numberOfScreen) {
    let i = 0;
    if (numberOfScreen === 5) {
        containers[5].style.display = 'flex';
    } else {
        for (const container in containers) {
            if (i === numberOfScreen) {
                containers[container].style.display = 'flex';
            } else {
                containers[container].style.display = 'none';
            }
            i++;
        }
    }

}