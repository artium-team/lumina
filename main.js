var x = 16, y = 20;

var frames = 0;

function init() {
    mode(0);
}
function update() {
    pset(x,y);

    if (btn(0)) {x -= 0.5;}
    if (btn(1)) x += 0.5;

    if (btn(2)) y -= 0.5;
    if (btn(3)) y += 0.5;

    if (btn(0) && frames > 15) { sound(200,200); frames = 0}

    frames += 1;
}