import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./game/gamegrid.js";
import { getNewGridObject } from "./game/gridobject.js";
import {app, setBunnyPos} from "./game/rendering.js"
var pupu;
function onMovePupu(x, y) {
    console.log("MOVE");
    if (tryMoveGridObjectToDir(pupu, x, y)) {
        //imo should be an event that rendering receives (or someone)
        //reDrawPupu(pupu.cell.x, pupu.cell.y);
        setBunnyPos(x, y);
    }
}

function createOnClickButtonDirectionEvent(buttonName, x, y) {
    let buttonInput = document.getElementById(buttonName);
    buttonInput.addEventListener("click", function () { onMovePupu(x, y) }, false);
}

document.body.appendChild(app.canvas);
const upButton = document.createElement("button");
const leftButton = document.createElement("button");
const rightButton = document.createElement("button");
const downButton = document.createElement("button");
upButton.innerText = "UP";
upButton.id = "upButton";
downButton.innerText = "DOWN"
downButton.id = "downButton";
leftButton.innerText = "LEFT"
leftButton.id = "leftButton";
rightButton.innerText = "RIGHT"
rightButton.id = "rightButton";
document.body.appendChild(upButton);
document.body.appendChild(leftButton);
document.body.appendChild(rightButton);
document.body.appendChild(downButton);

initGrid(11, 8);
pupu = getNewGridObject("pupu");
addToGrid(pupu, 0, 0);

createOnClickButtonDirectionEvent("upButton", 0, -1);
createOnClickButtonDirectionEvent("leftButton", -1, 0);
createOnClickButtonDirectionEvent("rightButton", 1, 0);
createOnClickButtonDirectionEvent("downButton", 0, 1);
