import { app } from "./game/rendering.js"

// write doc for main
/**
 * Adds the canvas to the document
 */
function main() {
    let canvas = app.canvas;
    document.getElementById("left-container").insertAdjacentElement("afterend", canvas);
    canvas.classList.add("is-flex");
    canvas.id = "game";
    console.log(canvas.classList);
}

main();
