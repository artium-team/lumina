# Lumina
A retro 8BIT Fantasy Console mode by Artium!

Games for Lumina can be written in [simple JavaScript code](./docs/README.md). Lumina games run in the browser of any PC or mobile device.

## How to make a game with Lumina

### Setup
Download `lumina.js`, add this tag to your HTML:

```html
    <script src="../src/lumina.js"></script>
```

### `init()` and `update()`

```js
function init() {
    // Put your code here and it will be called only on the first frame
}

function update() {
    // Put your code here and it will be called 60 time per second (60fps)
}
```

### Functions

`mode(x)` → Set display mode for Lumina, which has 3 modes:
- **Mode 0:** 32x32px display
- **Mode 1:** 64x64px display
- **Mode 2:** 128x128px display

And by default, Lumina use mode 1 instead of the 2 others

`btn(x)` → Will return value `true` or `false` if the button with id `x` is pressed or not
- **Button 0:** Left arrow (on both keyboard and the d-pad)
- **Button 1:** Right arrow (on both keyboard and the d-pad)
- **Button 2:** Up arrow (on both keyboard and the d-pad)
- **Button 3:** Down arrow (on both keyboard and the d-pad)
- **Button 4:** A key (`z` or `c` key on keyboard and the left button on the console display)
- **Button 5:** B key (`x` or `v` key on keyboard and the right button on the console display)
