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
    document.body.appendChild(app.canvas);
}

export function runGameCommands(list) {
    setCommandList(list);
    console.log("RUNNING COMMANDS FROM INDEX")
}
await main();
