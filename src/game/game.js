import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getGameGrid } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand, SayCommand } from "./commands.js";
import { commandsDone } from "./game_controller.js";
import { Constants } from "./commonstrings.js";

export class Game {
    constructor() {
        //give filemame tp create grid from here?
        this.grid = getGameGrid();
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height, this.onAnimsReady, this);
        this.canDoNextMove = true;
    }

    async init() {
        await this.gh.initialize();
        this.grid.gridObjects.forEach(item => {
            this.createGridEntitiesForRendering(item);
        });
    }

    createGridEntitiesForRendering(gridObject) {
        let data = { position: gridObject.getVector2Position() };
        this.gh.createEntity(gridObject.id, gridObject.type, data);
    }

    getCanvas() {
        return this.gh.getCanvas();
    }

    receiveInput(commandName, commandParameter) {

        if (commandName === Constants.MOVE_STR) {
            this.MakeMoveCommand(commandParameter);
        } else if (commandName === Constants.SAY_STR) {
            this.MakeSayCommand(commandParameter);
        }
    }

    onAnimsReady() {
        commandsDone();
    }

    MakeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        let moveCommand = new MoveCommand(this.grid, this.grid.player, dir, this.gh);
        //we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
    }

    MakeSayCommand(commandParameter) {
        let sayCommand = new SayCommand(this.grid.player, this.gh, commandParameter);
        sayCommand.execute();
    }

    resetGame() {
        this.grid.resetGrid();
        this.gh.resetAllGridObjects();
    }
}