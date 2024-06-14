import * as gameController from '../game/game_controller.js';
import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

//How to use for future users:
// - to make a new gamemode, extend above class
// - In grid when an event that interests you happens, use "this.eventTarget.dispatchEvent("description")" 
// - good example is grid.js last line in "removeFromGrid"
// - In a new GameMode class constructor, add a function to the eventtarget in grid. Look how current gamemodes do this.
// - This way you can only follow only things that interest you and use that to make custom gamemodes.
// - remember to call checkIfGameWon on victory
// - use globals instead of this

/**
 * Game mode where you win by collecting x amount of collectibles.
 */
export class GameModeGetCollectibles {
    constructor(grid) {
        grid.eventTarget.addEventListener("remove", this.removedFromGrid.bind(this));
        this.startScore = globals.collectibles.current;
        this.eventTarget = new EventTarget();
    }

    removedFromGrid(event) {
        let gridobject = event.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            globals.incrementCollectibles();
            console.log("Score is: " + globals.collectibles.current);
        }
    }

    // called by eventhandler after checking conditions
    checkIfGameWon() {
        if (globals.allConditionsCleared()) {
            this.eventTarget.dispatchEvent(new Event("victory"));
            gameController.notifyGameWon(true);
        } else {
            gameController.notifyGameWon(false);
        }
    }

    reset() {
        globals.collectibles.current = this.startScore;
    }
}

/**
 * Game mode where you win by clicking correct multiple choice option.
 * Winning happens in ui so this class does not have checkIfGameWon.
 */
export class GameModeMultipleChoice {
    constructor(grid) {
        grid.eventTarget.addEventListener("remove", this.removedFromGrid.bind(this));
        this.startScore = globals.collectibles.current;
        this.eventTarget = new EventTarget();
    }

    removedFromGrid(event) {
        let gridobject = event.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            globals.incrementCollectibles();
            console.log("Score is: " + globals.collectibles.current);
        }
    }

    // called by eventhandler after checking conditions
    checkIfGameWon() {
        if (globals.allConditionsCleared() && globals.getMultipleChoiceCorrect()) {
            this.eventTarget.dispatchEvent(new Event("victory"));
            gameController.notifyGameWon(true);
        } else {
            gameController.notifyGameWon(false);
        }
    }

    reset() {
        globals.collectibles.current = this.startScore;
    }
}