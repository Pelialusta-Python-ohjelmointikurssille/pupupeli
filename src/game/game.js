import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getGameTask } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand, SayCommand, AskCommand } from "./commands.js";
import { commandsDone, notifyGameWon } from "./game_controller.js";
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";
import { SKIN_BUNDLES } from "./graphics_handler/manifests/skin_manifest.js";

export class Game {
    constructor() {
        //getGameTask() returns object containing the grid and the gamemode
        let gameTask = getGameTask();
        this.grid = gameTask.grid;
        this.gameMode = gameTask.gameMode // this.initGameMode(gameTask);
        this.gameMode.eventTarget?.addEventListener("victory", this.gameHasBeenWon.bind(this));
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height, this.onAnimsReady, this);
        this.canDoNextMove = true;
        this.gameWon = false;

        this.isGridEnabled = true;
    }

    async init() {
        await this.gh.initialize();
        this.grid.gridObjects.forEach(item => {
            this.createGridEntityForRendering(item);
        });
    }

    createGridEntityForRendering(gridObject) {
        let data = { gridPosition: gridObject.getVector2Position() };
        let skins = SKIN_BUNDLES[gridObject.type];
        this.gh.createEntity(gridObject.id, gridObject.type, data, skins);
    }

    getCanvas() {
        return this.gh.getCanvas();
    }

    receiveInput(commandName, commandParameter) {
        if (!this.gh.isReady) {
            this.gh.finishAnimationsImmediately();
        }
        this.gh.destroyTextBoxes();
        if (commandName === Constants.MOVE_STR) {
            this.makeMoveCommand(commandParameter);
        } else if (commandName === Constants.SAY_STR) {
            this.makeSayCommand(commandParameter);
        } else if (commandName === Constants.ASK_STR) {
            this.makeAskCommand(commandParameter);
        }
    }

    /**
     * Calls game_controller.commandsDone. if gameWon is true, calls game_controller.notifyGameWon.
     * This.gameWon is changed to FALSE after this method, to reset that state without initialising new game entirely.
     * This is necessary to not call gamewon and display celebration box after inputting wrong code after a succesful pass.
     */
    onAnimsReady() {
        if (this.gameWon === true) {
            notifyGameWon();
        }
        commandsDone();
        this.gameWon = false;
    }

    makeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        let moveCommand = new MoveCommand(this.grid, this.grid.player, dir, this.gh);
        //we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
    }

    makeSayCommand(commandParameter) {
        let sayCommand = new SayCommand(this.grid.player, this.gh, commandParameter);
        sayCommand.execute();
    }

    makeAskCommand(commandParameter) {
        let moveCommand = new AskCommand(this.grid.player, this.gh, commandParameter);
        moveCommand.execute();
        this.onAnimsReady();
    }

    resetGame() {
        this.gh.destroyTextBoxes();
        this.grid.resetGrid();
        this.gh.resetGridObjects();
        this.gh.destroyTextBoxes();
        this.gameMode.reset();
        this.gh.destroyTextBoxes();
    }

    /**
     * changes gameWon attribute to true
     */
    gameHasBeenWon() {
        console.log("Olet voittanut pelin!");
        console.log("Loppupisteesi on: " + globals.collectibles.current);
        this.gameWon = true;
    }

    setTheme(theme) {
        if (theme === "Pupu") {
            this.gh.setEntityThemes("bunny");
        }
        if (theme === "Robo") {
            this.gh.setEntityThemes("robot");
        }
    }

    toggleGrid() {
        if (this.isGridEnabled === true) {
            this.isGridEnabled = false;
            this.gh.setGridState(false);
        } else {
            this.isGridEnabled = true;
            this.gh.setGridState(true);
        }
    }

    toggleTrail() {
        let id = this.grid.player.id;
        let playerGraphicsPawn = this.gh.getEntity(id);
        playerGraphicsPawn.lineDrawer?.toggle();
    }
}