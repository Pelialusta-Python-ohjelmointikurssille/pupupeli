import { Renderer } from "./rendering.js";
import { Direction } from "./direction.js";
import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";


let renderer;
let app;
let player;

export async function InitGame() {
    initGrid(8, 8);
    var pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    renderer = await getRenderer();
    await renderer.init();
    return renderer.pixiApp;
}

async function getRenderer() {
    let renderer = new Renderer();
    await renderer.init();
    return renderer;
}

export function setCommandList(list) {
    console.log("game.js")
    console.log(list);
    console.log(renderer);
    console.log("................")
    if (list == null || renderer == null) {
        return;
    }
    console.log(list)
    renderer.commands = list;
}
