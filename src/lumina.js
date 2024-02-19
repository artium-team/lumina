(function (exports) {
    "use strict";

    let resolution = 350;
    const fps = 60;
    let canvas, ctx, audioContext;

    const colors = ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"];
    const keyMap = [false, false, false, false, false, false]; // left right up down a b

    let upButton, downButton, leftButton, rightButton, aButton, bButton;
    let currentMode;

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

        const style = document.createElement("style");
        style.innerHTML = "body { margin: 0; overscroll-behavior-y: contain; height: 100%; overflow: hidden } #lumina-canvas {background-color: black; image-rendering: pixelated;} .button,.dpad-button{font-size:20px;text-align:center;line-height:50px;cursor:pointer}#canvas-container{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100vw;height:100vh}#lumina-canvas{border:1px solid #000;}.button-container{display:flex;gap:20px;padding:22px;background-color: #ffbf00;border-bottom-left-radius: 25px;border-bottom-right-radius: 25px;}.button{width:50px;height:50px;border:1px solid #000;border-radius:5px}.dpad-container{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;width:150px;height:150px}.dpad-button{position:absolute;width:50px;height:50px;border:1px solid #000;border-radius:50%}.button:active,.dpad-button:active{background:azure}.left,.right{top:50%;transform:translateY(-50%)}.left{left:0}.right{right:0}.down,.up{left:50%;transform:translateX(-50%)}.up{top:0}.down{bottom:0}";
        document.getElementsByTagName("head")[0].appendChild(style);

        function fromHTML(html, trim = true) {
            html = trim ? html : html.trim();
            if (!html) return null;

            const template = document.createElement('template');
            template.innerHTML = html;
            const result = template.content.children;

            if (result.length === 1) return result[0];
            return result;
        }

        const components = fromHTML(`
            <div id="canvas-container">
                <div class="button-container">
                    <div class="dpad-container">
                        <div class="dpad-button up"></div>
                        <div class="dpad-button left"></div>
                        <div class="dpad-button right"></div>
                        <div class="dpad-button down"></div>
                    </div>

                    <div class="button" style="position: relative; top: 50px; margin-left: 15px;"></div>
                    <div class="button" style="position: relative; top: 15px;"></div>
                </div>
            </div>
        `);
        document.body.appendChild(components);

        document.getElementById("canvas-container").insertBefore(canvas, document.getElementsByClassName("button-container")[0]);

        aButton = document.getElementsByClassName("button")[0];
        bButton = document.getElementsByClassName("button")[1];

        leftButton = document.getElementsByClassName("left")[0];
        rightButton = document.getElementsByClassName("right")[0];
        upButton = document.getElementsByClassName("up")[0];
        downButton = document.getElementsByClassName("down")[0];

        leftButton.addEventListener("mousedown", () => {
            keysPressed['ArrowLeft'] = true;
            console.log("!");
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        rightButton.addEventListener("mousedown", () => {
            keysPressed['ArrowRight'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        upButton.addEventListener("mousedown", () => {
            keysPressed['ArrowUp'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        downButton.addEventListener("mousedown", () => {
            keysPressed['ArrowDown'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        aButton.addEventListener("mousedown", () => {
            keysPressed['z'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        bButton.addEventListener("mousedown", () => {
            keysPressed['x'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });

        leftButton.addEventListener("touchstart", () => {
            keysPressed['ArrowLeft'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        rightButton.addEventListener("touchstart", () => {
            keysPressed['ArrowRight'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        upButton.addEventListener("touchstart", () => {
            keysPressed['ArrowUp'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        downButton.addEventListener("touchstart", () => {
            keysPressed['ArrowDown'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        aButton.addEventListener("touchstart", () => {
            keysPressed['z'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });
        bButton.addEventListener("touchstart", () => {
            keysPressed['x'] = true;
            if (notStart) {
                intro();
                notStart = false;
            }
        });

        leftButton.addEventListener("touchend", () => {
            keysPressed['ArrowLeft'] = false;
        });
        rightButton.addEventListener("touchend", () => {
            keysPressed['ArrowRight'] = false;
        });
        upButton.addEventListener("touchend", () => {
            keysPressed['ArrowUp'] = false;
        });
        downButton.addEventListener("touchend", () => {
            keysPressed['ArrowDown'] = false;
        });
        aButton.addEventListener("touchend", () => {
            keysPressed['z'] = false;
        });
        bButton.addEventListener("touchend", () => {
            keysPressed['x'] = false;
        });

        leftButton.addEventListener("mouseup", () => {
            keysPressed['ArrowLeft'] = false;
        });
        rightButton.addEventListener("mouseup", () => {
            keysPressed['ArrowRight'] = false;
        });
        upButton.addEventListener("mouseup", () => {
            keysPressed['ArrowUp'] = false;
        });
        downButton.addEventListener("mouseup", () => {
            keysPressed['ArrowDown'] = false;
        });
        aButton.addEventListener("mouseup", () => {
            keysPressed['z'] = false;
        });
        bButton.addEventListener("mouseup", () => {
            keysPressed['x'] = false;
        });

        leftButton.addEventListener("mouseleave", () => {
            keysPressed['ArrowLeft'] = false;
        });
        rightButton.addEventListener("mouseleave", () => {
            keysPressed['ArrowRight'] = false;
        });
        upButton.addEventListener("mouseleave", () => {
            keysPressed['ArrowUp'] = false;
        });
        downButton.addEventListener("mouseleave", () => {
            keysPressed['ArrowDown'] = false;
        });
        aButton.addEventListener("mouseleave", () => {
            keysPressed['z'] = false;
        });
        bButton.addEventListener("mouseleave", () => {
            keysPressed['x'] = false;
        });

        resolution /= 64;
        // resolution /= 128;

        audioContext = new AudioContext();

        const font = new FontFace('font', 'url("https://raw.githubusercontent.com/artium-team/lumina/master/src/font.ttf")')
        font.load().then(function (font) {
            document.fonts.add(font);
            ctx.font = `${8 * resolution}px font`;
            try {
                init();
                cls();

                resolution = 350 / 64;
                ctx.font = `${8 * resolution}px font`;
                text("Press any button", 2, 30);
                text("to start", 17, 38);
                mode(currentMode);
            } catch { }
        });
    }

    const introFrames = 100;
    let numFrames = 0, note1 = false, note2 = false;

    const intro = function () {
        cls();

        if (numFrames > introFrames == false) {
            numFrames += 5;
            circfill(Math.pow(2, currentMode) * 32 / 2, Math.pow(2, currentMode) * 32 / 2, numFrames, 8);
            circfill(Math.pow(2, currentMode) * 32 / 2, Math.pow(2, currentMode) * 32 / 2, numFrames - 20, 9);
            circfill(Math.pow(2, currentMode) * 32 / 2, Math.pow(2, currentMode) * 32 / 2, numFrames - 40, 10);
            circfill(Math.pow(2, currentMode) * 32 / 2, Math.pow(2, currentMode) * 32 / 2, numFrames - 60, 11);
            circfill(Math.pow(2, currentMode) * 32 / 2, Math.pow(2, currentMode) * 32 / 2, numFrames - 60, 0);
            if (numFrames > 60 && !note1) {
                sound(622, 200);
                note1 = true;
            }
            if (numFrames > 90 && !note2) {
                sound(880, 300);
                note2 = true;
            }
            setTimeout(() => {
                requestAnimationFrame(intro);
            }, 1000 / fps);
        }
        else {
            loop();
        }
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

    let notStart = true;
    window.onload = () => {
        setup();
    }

    let keysPressed = [];
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        if (keysPressed['ArrowLeft']) leftButton.style.background = 'azure';
        if (keysPressed['ArrowRight']) rightButton.style.background = 'azure';
        if (keysPressed['ArrowUp']) upButton.style.background = 'azure';
        if (keysPressed['ArrowDown']) downButton.style.background = 'azure';
        if (keysPressed['z'] || keysPressed['c']) aButton.style.background = 'azure';
        if (keysPressed['x'] || keysPressed['v']) bButton.style.background = 'azure';

        if (notStart) {
            intro();
            notStart = false;
        }
    });
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;

        if (!keysPressed['ArrowLeft']) leftButton.style.background = 'none';
        if (!keysPressed['ArrowRight']) rightButton.style.background = 'none';
        if (!keysPressed['ArrowUp']) upButton.style.background = 'none';
        if (!keysPressed['ArrowDown']) downButton.style.background = 'none';
        if (!keysPressed['z'] && !keysPressed['c']) aButton.style.background = 'none';
        if (!keysPressed['x'] && !keysPressed['v']) bButton.style.background = 'none';
    });

    const cls = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const mode = function (mode) {
        if (mode == 0) {
            resolution = 350 / 32;
        }
        else if (mode == 1) {
            resolution = 350 / 64;
        }
        else if (mode == 2) {
            resolution = 350 / 128;
        }

        if (mode >= 0 && mode <= 2) {
            currentMode = mode;
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

    const text = function (text, x, y, col) {
        col = colors[col];
        if (!col) { col = "#FFF1E8" };
        ctx.fillStyle = col;

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
            gainNode.gain.value = 0.25;
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            setTimeout(() => gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.015), duration);
        })
    };

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