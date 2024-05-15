import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";
import { reDrawPupu } from "./rendering.js";
var pupu;

//remember to checkout console for debugging
window.onload = function () {
    initGrid(8, 8, 50);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    //grid uppest leftest (0 , 0)
    createOnClickButtonDirectionEvent("upButton", 0, -1);
    createOnClickButtonDirectionEvent("leftButton", -1, 0);
    createOnClickButtonDirectionEvent("rightButton", 1, 0);
    createOnClickButtonDirectionEvent("downButton", 0, 1);
}

function onMovePupu(x, y) {
    if (tryMoveGridObjectToDir(pupu, x, y)) {
        //imo should be an event that rendering receives (or someone)
        reDrawPupu(pupu.cell.x, pupu.cell.y);
    }
}

function createOnClickButtonDirectionEvent(buttonName, x, y) {
    let buttonInput = document.getElementById(buttonName);
    buttonInput.addEventListener("click", function () { onMovePupu(x, y) }, false);
}