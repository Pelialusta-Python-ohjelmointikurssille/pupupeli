import { app, setBunnyPos } from "./game/rendering.js"
import {InitGame, MovePupu} from "./game/initgame.js"
var pupu;

// write doc for main
/**
 * Initializes the game and adds the canvas to the document
 */
function main() {
    document.body.appendChild(app.canvas);
    CreateMovePupuButtons();
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

// write doc for CreateMovePupuButtons
/**
 * Creates buttons to move the Pupu object
 */
function CreateMovePupuButtons() {
    CreateButton("upButton", "UP");
    CreateButton("downButton", "DOWN");
    CreateButton("leftButton", "LEFT");
    CreateButton("rightButton", "RIGHT");
    createOnClickButtonDirectionEvent("upButton", 0, -1);
    createOnClickButtonDirectionEvent("leftButton", -1, 0);
    createOnClickButtonDirectionEvent("rightButton", 1, 0);
    createOnClickButtonDirectionEvent("downButton", 0, 1);
}

// write doc for CreateButton
/**
 * Creates a button with the specified id and inner text
 * @param {string} id - The id of the button
 * @param {string} innerText - The inner text of the button
 */
function CreateButton(id, innerText) {
    let button = document.createElement("button");
    button.id = id;
    button.innerText = innerText;
    document.body.appendChild(button);
}

// write doc for createOnClickButtonDirectionEvent
/**
 * Creates an event listener for a button that moves the Pupu object in the specified direction
 * @param {string} buttonName - The name of the button
 * @param {number} x - The x direction to move
 * @param {number} y - The y direction to move
 */
function createOnClickButtonDirectionEvent(buttonName, x, y) {
    let buttonInput = document.getElementById(buttonName);
    buttonInput.addEventListener("click", function () { onMovePupu(x, y) }, false);
}

main();
