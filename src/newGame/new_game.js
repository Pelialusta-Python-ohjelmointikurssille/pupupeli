import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";

export class Game {
    constructor() {
        this.gh = new GraphicsHandler();
    }

    async init() {
        await this.gh.initialize();
    }
    getCanvas() {
        return this.gh.getCanvas();
    }
}