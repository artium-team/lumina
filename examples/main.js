var pipes = [{}, {}, {}, {}, {}];
var x = 16, y = 33;
var speed = 0.5;

function init() {
    for (let i = 0; i < 5; i++) {
        pipes[i].x = 60 + 25 * i;
        pipes[i].y = Math.random() * 30 - 25;
    }
}

function player(x, y) {
    pset(x, y, 8);
    pset(x - 1, y + 1, 8);
    pset(x - 1, y - 1, 8);
}

function pipe(x, y) {
    rect(x, 32 + y, x + 10, 0);
}

function update() {
    player(x, y);

    if (btn(2)) y -= 1.5;
    if (btn(3)) y += 1.5;

    speed = Math.min(Math.max(speed, 0.5), 2);

    for (let i = 0; i < 5; i++) {
        pipes[i].x -= speed;
        pipe(pipes[i].x, pipes[i].y);
        if (pipes[i].x + 10 < 0) {
            pipes.shift();
            pipes.push({ x: pipes[3].x + 25, y: Math.random() * 20 - 10 });
            speed += 0.1;
        }
    }
}