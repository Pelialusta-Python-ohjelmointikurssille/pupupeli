import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getNewGameGrid } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand } from "./commands.js";

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

    receiveInput(commandName, commandParameter) {
        if (commandName === "move") {
            MakeMoveCommand(commandParameter);
        }
    }

    MakeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        moveCommand = new MoveCommand(grid, dir);
        //we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
    }
}