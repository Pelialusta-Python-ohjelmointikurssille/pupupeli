import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getGameTask } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand, SayCommand } from "./commands.js";
import { commandsDone, notifyGameWon } from "./game_controller.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

export class Game {
    constructor() {
        //getGameTask() returns object containing the grid and the gamemode
        let gameTask = getGameTask();
        this.grid = gameTask.grid;
        this.gameMode = gameTask.gameMode;
        this.gameMode.eventTarget.addEventListener("victory", this.gameHasBeenWon.bind(this));
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height, this.onAnimsReady, this);
        this.canDoNextMove = true;
        this.gameWon = false;
    }

    async init() {
        await this.gh.initialize();
        this.grid.gridObjects.forEach(item => {
            this.createGridEntityForRendering(item);
        });
    }

    createGridEntityForRendering(gridObject) {
        let data = { position: gridObject.getVector2Position() };
        this.gh.createEntity(gridObject.id, gridObject.type, data);
    }

    getCanvas() {
        return this.gh.getCanvas();
    }

    receiveInput(commandName, commandParameter) {
        //If we are already executing a command, (animation not finished),
        //we have the option of waiting for the current one finishing, 
        //OR, quickly finishing the current one. 
        //Because of how the logic works, I will for now opt into quickly finishing the current ones.
        if (this.gh.isReady) {
            console.log("My body is ready.");
        } else {
            console.log("I AM NOT READY!!!!!!");
        }
        //-----------------------------------------------
        if (commandName === Constants.MOVE_STR) {
            this.MakeMoveCommand(commandParameter);
        } else if (commandName === Constants.SAY_STR) {
            this.MakeSayCommand(commandParameter);
        }
    }

    /**
     * Calls game_controller.commandsDone. if gameWon is true, calls game_controller.notifyGameWon
     */
    onAnimsReady() {
        if (this.gameWon === true) {
            notifyGameWon();
        }
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
        this.gh.resetGridObjects();
        this.gh.destroyTextBoxes();
        this.gameMode.reset();
    }

    /**
     * changes gameWon attribute to true
     */
    gameHasBeenWon() {
        console.log("Olet voittanut pelin!");
        console.log("Loppupisteesi on: " + globals.collectibles.current);
        this.gameWon = true;
    }
}