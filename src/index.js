import { InitGame, setCommandList } from "./game/game.js"

// write doc for main
/**
 * Adds the canvas to the document
 */

async function main() {
    await CreateGameWindow();
}

async function CreateGameWindow() {
    let app = await InitGame();
    let canvas = app.canvas;
    
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
}

export function runGameCommands(list) {
    setCommandList(list);
    console.log("RUNNING COMMANDS FROM INDEX")
}
await main();
