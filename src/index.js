import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./game/gamegrid.js";
import { getNewGridObject } from "./game/gridobject.js";
import { app, setBunnyPos } from "./game/rendering.js"
var pupu;

main();

function main() {
    document.body.appendChild(app.canvas);
    CreateMovePupuButtons();
    InitGame();
}

function InitGame() {
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
}

function onMovePupu(x, y) {
    console.log("MOVE");
    if (tryMoveGridObjectToDir(pupu, x, y)) {
        setBunnyPos(x, y);
    }
}

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

function CreateButton(id, innerText) {
    let button = document.createElement("button");
    button.id = id;
    button.innerText = innerText;
    document.body.appendChild(button);
}

function createOnClickButtonDirectionEvent(buttonName, x, y) {
    let buttonInput = document.getElementById(buttonName);
    buttonInput.addEventListener("click", function () { onMovePupu(x, y) }, false);
}