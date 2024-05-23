import { app } from "./game/rendering.js"

// write doc for main
/**
 * Adds the canvas to the document
 */
function main() {
    document.body.appendChild(app.canvas);
}

main();
