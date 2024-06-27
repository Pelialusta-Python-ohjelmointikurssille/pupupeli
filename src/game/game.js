import { GraphicsHandler } from "./graphics_handler/graphics_handler.js";
import { getGameTask } from "./gridfactory.js";
import { translatePythonMoveStringToDirection } from "./direction.js";
import { MoveCommand, SayCommand, AskCommand } from "./commands.js";
import { commandsDone } from "./game_controller.js";
import { Constants } from "./commonstrings.js";
import { SKIN_BUNDLES } from "./graphics_handler/manifests/skin_manifest.js";
import { GridObject } from "./gridobject.js";
import { AnimationNames } from "./graphics_handler/manifests/animation_manifest.js";
import { CollectibleCounter } from "./collectible_counter.js";

export class Game {
    constructor() {
        this.grid = getGameTask();
        this.collectibleCounter = new CollectibleCounter(this.grid);
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height, this.onAnimsReady, this);
        this.canDoNextMove = true;
        this.gameWon = false;
        this.isGridEnabled = true;
        this.tempObjectIds = [];
    }

    /**
     * Init function starts rendering of all the objects in the game grid.
     */
    async init() {
        await this.gh.initialize();
        this.grid.gridObjects.forEach(item => {
            this.createGridEntityForRendering(item);
        });
    }

    /**
     * Graphics handler creates it's own entities from gridobjects that it renders.
     * The entities can then be refrenced later with the id of gridobjects.
     * @param {*} gridObject gridObject you want to render
     */
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
        this.gh.destroyTextBoxes(); //just a extra check?
        switch (commandName) {
            case Constants.MOVE_STR:
                this.makeMoveCommand(commandParameter);
                break;
            case Constants.SAY_STR:
                this.makeSayCommand(commandParameter);
                break;
            case Constants.ASK_STR:
                this.makeAskCommand(commandParameter);
                break;
        }
    }

    /**
     * Calls game_controller.commandsDone. if gameWon is true, calls game_controller.notifyGameWon.
     * This.gameWon is changed to FALSE after this method, to reset that state without initialising new game entirely.
     * This is necessary to not call gamewon and display celebration box after inputting wrong code after a succesful pass.
     */
    onAnimsReady() {
        commandsDone();
        this.gameWon = false;
    }

    makeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        let moveCommand = new MoveCommand(this.grid, this.grid.player, dir, this.gh, this);
        //we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
    }

    makeSayCommand(commandParameter) {
        let sayCommand = new SayCommand(this.grid.player, this.gh, commandParameter);
        sayCommand.execute();
    }

    makeAskCommand(commandParameter) {
        let askCommand = new AskCommand(this.grid.player, this.gh, commandParameter);
        askCommand.execute();
        this.onAnimsReady();
    }

    resetGame() {
        this.gh.destroyTextBoxes();
        this.grid.resetGrid();
        this.gh.resetGridObjects();
        this.gh.destroyTextBoxes();
        this.gh.destroyTextBoxes();
        this.destroyTempObjects();
        this.collectibleCounter.reset();
    }

    destroyTempObjects() {
        for (let i = 0; i < this.tempObjectIds.length; i++) {
            this.gh.destroyEntity(this.tempObjectIds[i]);
        }
        this.tempObjectIds = [];
    }

    /**
     * changes gameWon attribute to true
     */
    allCollectablesGained() {
        console.log("Kaikki porkkanat kerätty!");
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
        this.isGridEnabled = !this.isGridEnabled;
        this.gh.setGridState(this.isGridEnabled);
    }

    toggleTrail() {
        let id = this.grid.player.id;
        let playerGraphicsPawn = this.gh.getEntity(id);
        playerGraphicsPawn.lineDrawer?.toggle();
    }

    createNewPlayerCreatedGridObject(type, x, y) {
        if (!type) {
            this.makeSayCommand("Ups, luonti ei onnistunut koska en tiedä mitä objektia tarkoitat.");
            return;
        }
        if (!this.grid.boundaryCheck(x, y)) {
            this.makeSayCommand("Ei onnistu, se ei mahdu ruudukkoon! (" + x + ", " + y + ")");
            return;
        }
        if (this.grid.getObjectsAtGridPosition(x, y).length > 0) {
            this.makeSayCommand("En voi luoda sinne koska siellä on jo jotain! (" + x + ", " + y + ")");
            return;
        }
        let newGO = new GridObject(type);
        this.grid.addToGrid(newGO, x, y);
        this.createGridEntityForRendering(newGO);
        this.tempObjectIds.push(newGO.id);
        this.setTheme(localStorage.getItem("theme"));
    }

    destroyObject(x, y) {
        let list = this.grid.getObjectsAtGridPosition(x, y);
        if (list.length <= 0) {
            this.makeSayCommand("Ei ole poistettavaa! (" + x + ", " + y + ")");
            return;
        }
        let gridObject = list[0];
        if (gridObject === this.grid.player) {
            this.makeSayCommand("Et voi poistaa minua! (" + x + ", " + y + ")");
            return;
        }
        this.gh.doAction(gridObject.id, AnimationNames.APPEAR_HIDE, { time: 0.5 });
        this.grid.removeFromGrid(gridObject);
    }
}