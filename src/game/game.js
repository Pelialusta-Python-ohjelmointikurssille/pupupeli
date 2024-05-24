import { Renderer } from "./rendering.js";
import { Direction } from "./direction.js";
import { initGrid, addToGrid, moveGridObjectToDir as tryMoveGridObjectToDir } from "./gamegrid.js";
import { getNewGridObject } from "./gridobject.js";


let renderer;
let turnTimer = 0;
const turnTimeSeconds = 1;
let commands = [];
var pupu;

let commandDirs = {
    "oikea": Direction.Right,
    "vasen": Direction.Left,
    "alas": Direction.Down,
    "ylös": Direction.Up
}

export async function InitGame() {
    initGrid(8, 8);
    pupu = getNewGridObject("pupu");
    addToGrid(pupu, 0, 0);
    renderer = await getRenderer();
    await renderer.init();
    renderer.addFunctionToLoop(onUpdate);
    return renderer.pixiApp;
}

async function getRenderer() {
    let renderer = new Renderer();
    await renderer.init();
    return renderer;
}

export function setCommandList(list) {
    if (list == null || renderer == null) {
        return;
    }
    if (commands.length > 0) return;
    commands = list;
}

function onUpdate(deltaTime) {
    if (turnTimer < turnTimeSeconds && commands.length > 0) {
        turnTimer += deltaTime;
    }
    if (turnTimer >= turnTimeSeconds) {
        processTurn();
        turnTimer = 0;
    }
}

function processTurn () {
    if (commands == null) {
        return;
    }
    if (commands.length <= 0) {
        return;
    }
    let newCommand = commands.shift();
    if (tryMoveGridObjectToDir(pupu, commandDirs[newCommand])) {
        renderer.player.moveToDirection (commandDirs[newCommand]);
    }
}

export function rendererToggleGrid () {
    renderer.toggleGrid();
}
