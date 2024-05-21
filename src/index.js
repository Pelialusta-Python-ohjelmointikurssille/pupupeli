import { app, setBunnyPos } from "./game/rendering.js"
import { InitGame, MovePupu } from "./game/initgame.js"
var pupu;

// write doc for main
/**
 * Initializes the game and adds the canvas to the document
 */
function main() {
    document.body.appendChild(app.canvas);
    pupu = InitGame();
}

// write doc for onMovePupu
/**
 * Moves the Pupu object in the specified direction
 * @param {number} x - The x direction to move
 * @param {number} y - The y direction to move
*/
function onMovePupu(x, y) {
    console.log("MOVE");
    if (MovePupu(pupu, x, y)) {
        setBunnyPos(x, y);
    }
}

export function moveBunny(direction) {
    switch (direction) {
        case "oikea":
            onMovePupu(1, 0)
            break;
        case "vasen":
            onMovePupu(-1, 0)
            break;
        case "ylös":
            onMovePupu(0, -1)
            break;
        case "alas":
            onMovePupu(0, 1)
            break;
    }
}

main();
