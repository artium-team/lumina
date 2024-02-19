var x = 16, y = 20;

var frames = 0;

function init() {
    mode(1);
}
function update() {
    pset(x,y);
    circ(10,30, 5);

    if (btn(0)) {x -= 1;}
    if (btn(1)) x += 1;

    if (btn(2)) y -= 1;
    if (btn(3)) y += 1;

    if (btn(0) && frames > 15) { sound(493,100); frames = 0}
    if (btn(1) && frames > 15) { sound(493,100); frames = 0}
    if (btn(2) && frames > 15) { sound(493,100); frames = 0}
    if (btn(3) && frames > 15) { sound(493,100); frames = 0}

    text(60, 40,40)

    frames += 1;
}