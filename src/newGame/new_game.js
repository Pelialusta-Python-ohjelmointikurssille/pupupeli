import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getNewGameGrid } from "./gridfactory.js";

export class Game {
    constructor() {
        //give filemame tp create grid from here?
        this.grid = getNewGameGrid();
        this.gh = new GraphicsHandler(this.grid.getWidth(), this.grid.getHeight());
    }

    async init() {
        await this.gh.initialize();
    }
    getCanvas() {
        return this.gh.getCanvas();
    }
}