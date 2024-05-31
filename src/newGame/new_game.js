import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getNewGameGrid } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand } from "./commands.js";

export class Game {
    constructor() {
        //give filemame tp create grid from here?
        this.grid = getNewGameGrid();
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height);
    }

    async init() {
        await this.gh.initialize();
        let gObjects = this.grid.gridObjects;
        //TODO init objects here
        //for (let i = 0; i > gObjects.length; i++) {
        //    this.gh.createEntity(gObjects[1]);
        //}
    }
    getCanvas() {
        return this.gh.getCanvas();
    }

    receiveInput(commandName, commandParameter) {
        if (commandName === "move") {
            this.MakeMoveCommand(commandParameter);
        }
    }

    MakeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        let moveCommand = new MoveCommand(this.grid, this.grid.player, dir);
        //we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
        //debug
        this.grid.consoleDebug();
    }
}