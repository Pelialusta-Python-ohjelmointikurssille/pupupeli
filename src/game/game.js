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

/**
 * The game logic controlled by game_controller.js. Handles grid logic and rendering.
 */
export class Game {
    constructor() {
        this.grid = getGameTask();
        this.collectibleCounter = new CollectibleCounter(this.grid);
        this.gh = new GraphicsHandler(this.grid.width, this.grid.height, this.onAnimsReady, this);
        this.canDoNextMove = true;
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

    /**
     * @returns Gets the pixiApp.canvas.
     */
    getCanvas() {
        return this.gh.getCanvas();
    }

    /**
     * Tries to execute received command in the game.
     * @param {*} commandName String describing the command. You can find them from commonstring.js Constants.
     * @param {*} commandParameter Additional parameters needed for the command. Check user_commands.md.
     */
    receiveInput(commandName, commandParameter) {
        if (!this.gh.isReady) {
            this.gh.finishAnimationsImmediately();
        }
        this.gh.destroyTextBoxes();
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
     * Calls game_controller.commandsDone. This can be used to wait for game animations before continuing.
     */
    onAnimsReady() {
        commandsDone();
    }

    /**
     * Moves the character to the given direction. If it hits a wall, plays an animation hitting the wall.
     * @param {*} commandParameter String containing the direction in finnish.
     */
    makeMoveCommand(commandParameter) {
        let dir = translatePythonMoveStringToDirection(commandParameter);
        let moveCommand = new MoveCommand(this.grid, this.grid.player, dir, this.gh, this);
        //(possibility) we can save moveCommand for later when/if we want to add undo functionality
        moveCommand.execute();
    }

    /**
     * Creates a speech bubble above player containing text.
     * @param {*} commandParameter text added to the speech bubble
     */
    makeSayCommand(commandParameter) {
        let sayCommand = new SayCommand(this.grid.player, this.gh, commandParameter);
        sayCommand.execute();
    }

    /**
     * Asks input from player. The input happens alongside a speechbubble.
     * @param {*} commandParameter The question asked and added to the speechbubble.
     */
    makeAskCommand(commandParameter) {
        let askCommand = new AskCommand(this.grid.player, this.gh, commandParameter);
        askCommand.execute();
        this.onAnimsReady();
    }

    /**
     * Restores the gamestate back to the beginning of the task.
     */
    resetGame() {
        this.gh.destroyTextBoxes();
        this.grid.resetGrid();
        this.gh.resetGridObjects();
        this.gh.destroyTextBoxes();
        this.gh.destroyTextBoxes();
        this.destroyTempObjects();
        this.collectibleCounter.reset();
    }

    /**
     * Adding gridobjects trough "createNewPlayerCreatedGridObject" adds them to the grid and renders them.
     * They dissappear from the grid by themselves on reset, but this function
     * removes them also from rendering.
     */
    destroyTempObjects() {
        for (let i = 0; i < this.tempObjectIds.length; i++) {
            this.gh.destroyEntity(this.tempObjectIds[i]);
        }
        this.tempObjectIds = [];
    }

    /**
     * Changes theme, currently uses the finnish name of the theme
     * @param {*} theme theme to change into in finnish
     */
    setTheme(theme) {
        console.log(localStorage.getItem("theme"));
        if (theme === "Pupu") {
            this.gh.setEntityThemes("bunny");
        }
        if (theme === "Robo") {
            this.gh.setEntityThemes("robot");
        }
    }

    /**
     * Toggles a grid that is drawn to see the grid easier and the indexes of the x and y in the grid
     */
    toggleGrid() {
        this.isGridEnabled = !this.isGridEnabled;
        this.gh.setGridState(this.isGridEnabled);
    }

    /**
     * Toggles the rendering of the trail on and off. It draws a line representing the route of player in the grid. 
     */
    toggleTrail() {
        let id = this.grid.player.id;
        let playerGraphicsPawn = this.gh.getEntity(id);
        playerGraphicsPawn.lineDrawer?.toggle();
    }

    /**
     * Creates a new object to the grid. This is not a command, and is executed immediately. 
     * When failing, creates a speech bubble that tells the reason for failure.
     * New player can't be created.
     * Objects are destroyed on reset.
     * @param {*} type 
     * @param {*} x 
     * @param {*} y 
     * @returns none
     */
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

    /**
     * Destroys any object from the grid, with the exception of player.
     * Objects are restored after reset.
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
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