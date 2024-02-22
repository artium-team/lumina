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

### Functions

`mode(x)` → Set display mode for Lumina, which has 3 modes:
- **Mode 0:** 32x32px display
- **Mode 1:** 64x64px display
- **Mode 2:** 128x128px display

And by default, Lumina use mode 1 instead of the 2 others
