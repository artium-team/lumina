(function (exports) {
    "use strict";

    let resolution = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) - 10;
    const fps = 60;
    let canvas, ctx, audioContext;

    const colors = ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"];
    const keyMap = [false, false, false, false, false, false]; // left right up down a b

    const setup = function () {
        const pixelRatio = (function () {
            const ctx = document.createElement("canvas").getContext("2d"),
                dpr = window.devicePixelRatio || 1,
                bsr = ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1;

            return dpr / bsr;
        })();

        const createHiDPICanvas = function (w, h, ratio) {
            if (!ratio) { ratio = pixelRatio; }
            const canvas = document.createElement("canvas");
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            canvas.id = "lumina-canvas";
            return canvas;
        }

        canvas = createHiDPICanvas(resolution, resolution, 4);
        ctx = canvas.getContext("2d");

        document.body.appendChild(canvas);

        const style = document.createElement("style");
        style.innerHTML = "body { margin: 0; display: flex; justify-content: center; align-items: center; } canvas {background-color: black; image-rendering: pixelated;}";
        document.getElementsByTagName("head")[0].appendChild(style);

        

        resolution /= 64;
        // resolution /= 128;

        audioContext = new AudioContext();

        const font = new FontFace('font', 'url("./font.ttf")');
        font.load().then(function (font) {
            document.fonts.add(font);
            ctx.font = `${8 * resolution}px font`;
            try {
                init();
            } catch { }
        });
    }

    const loop = function () {
        cls();
        try {
            update();
        } catch { }

        setTimeout(() => {
            requestAnimationFrame(loop);
        }, 1000 / fps);
    }

    let keysPressed = [];
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });

    const cls = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const mode = function (mode) {
        if (mode == 0) {
            resolution = ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) - 20) / 32;
        }
        else if (mode == 1) {
            resolution = ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) - 20) / 64;
        }
        else if (mode == 2) {
            resolution = ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) - 20) / 128;
        }
        ctx.font = `${8 * resolution}px font`;
    }

    const btn = function (key) {

        keyMap[0] = keysPressed['ArrowLeft'];
        keyMap[1] = keysPressed['ArrowRight'];
        keyMap[2] = keysPressed['ArrowUp'];
        keyMap[3] = keysPressed['ArrowDown'];
        keyMap[4] = keysPressed['z'] || keysPressed['c'];
        keyMap[5] = keysPressed['x'] || keysPressed['v'];

        return keyMap[key];
    }

    const pset = function (x, y, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
    }

    const text = function (text, x, y) {
        ctx.fillText(text, x * resolution, y * resolution);
    }

    const line = function (x1, y1, x2, y2, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        var dx = x2 - x1, dy = y2 - y1;
        var sx = (dx > 0) - (dx < 0), sy = (dy > 0) - (dy < 0);
        dx *= sx; dy *= sy;

        ctx.fillRect(x1 * resolution, y1 * resolution, resolution, resolution);
        if (!(dx || dy)) return;
        var d = 0, x = x1, y = y1, v;
        if (dy < dx)
            for (v = 0 | (dy << 15) / dx * sy; x ^ x2; x += sx, d &= 32767)
                ctx.fillRect(x * resolution, (y += (d += v) >> 15) * resolution, resolution, resolution);
        else
            for (v = 0 | (dx << 15) / dy * sx; y ^ y2; y += sy, d &= 32767)
                ctx.fillRect((x += (d += v) >> 15) * resolution - resolution, y * resolution, resolution, resolution);
    }

    const circ = function (x, y, radius, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        let x0 = 0;
        let y0 = radius;
        let decision = 3 - 2 * radius;

        ctx.fillRect((x - y0) * resolution, y * resolution, resolution, resolution);
        ctx.fillRect((x + y0) * resolution, y * resolution, resolution, resolution);

        ctx.fillRect((x + x0) * resolution, (y + y0) * resolution, resolution, resolution);
        ctx.fillRect((x - x0) * resolution, (y + y0) * resolution, resolution, resolution);
        ctx.fillRect((x + x0) * resolution, (y - y0) * resolution, resolution, resolution);
        ctx.fillRect((x - x0) * resolution, (y - y0) * resolution, resolution, resolution);

        while (x0 <= y0) {
            x0++;
            if (decision < 0) {
                decision += 4 * x0 + 6;
            } else {
                y0--;
                decision += 4 * (x0 - y0) + 10;
            }
            ctx.fillRect((x + x0) * resolution, (y + y0) * resolution, resolution, resolution);
            ctx.fillRect((x - x0) * resolution, (y + y0) * resolution, resolution, resolution);
            ctx.fillRect((x + x0) * resolution, (y - y0) * resolution, resolution, resolution);
            ctx.fillRect((x - x0) * resolution, (y - y0) * resolution, resolution, resolution);
            ctx.fillRect((x + y0) * resolution, (y + x0) * resolution, resolution, resolution);
            ctx.fillRect((x - y0) * resolution, (y + x0) * resolution, resolution, resolution);
            ctx.fillRect((x + y0) * resolution, (y - x0) * resolution, resolution, resolution);
            ctx.fillRect((x - y0) * resolution, (y - x0) * resolution, resolution, resolution);
        }
    }

    const circfill = function (x, y, radius, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        function distance(p1, p2) {
            var dx = p2.x - p1.x; dx *= dx;
            var dy = p2.y - p1.y; dy *= dy;
            return Math.sqrt(dx + dy);
        }

        for (var j = x - radius; j <= x + radius; j++) {
            for (var k = y - radius; k <= y + radius; k++) {
                if (distance({ x: j, y: k }, { x: x, y: y }) <= radius) {
                    ctx.fillRect(j * resolution, k * resolution, resolution + 1, resolution + 1);
                }
            }
        }
    }

    const rect = function (x1, y1, x2, y2, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        var width = x2 - x1, height = y2 - y1;

        ctx.fillRect(x1 * resolution, y1 * resolution, resolution + 1, resolution + 1);
        ctx.fillRect(x1 * resolution, y2 * resolution, resolution + 1, resolution + 1);
        ctx.fillRect(x2 * resolution, y1 * resolution, resolution + 1, resolution + 1);
        ctx.fillRect(x2 * resolution, y2 * resolution, resolution + 1, resolution + 1);

        ctx.fillRect(x1 * resolution, y1 * resolution, resolution + 1, height * resolution);
        ctx.fillRect(x1 * resolution, y1 * resolution, width * resolution, resolution + 1);
        ctx.fillRect(x2 * resolution, y2 * resolution, resolution + 1, -height * resolution);
        ctx.fillRect(x2 * resolution, y2 * resolution, -width * resolution, resolution + 1);
    }

    const rectfill = function (x1, y1, x2, y2, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

        var width = x2 - x1, height = y2 - y1;

        ctx.fillRect(x1 * resolution, y1 * resolution, width * resolution, height * resolution);
    }

    const sound = (frequency, duration) => {
        audioContext.resume().then(() => {
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5;
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            setTimeout(() => gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.015), duration);
        })
    };

    window.onload = () => {
        setup();
        loop();
    }

    exports.mode = mode;
    exports.btn = btn;
    exports.pset = pset;
    exports.text = text;
    exports.line = line;
    exports.circ = circ;
    exports.circfill = circfill;
    exports.rect = rect;
    exports.rectfill = rectfill;

    exports.sound = sound;

})(window || {});