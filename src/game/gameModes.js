import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";
//Interface gamemode is used to track players progress in the level and know when player has beaten the level.
/**
 * The interface for GameMode
 */
const GameMode = {
    reset: function () { },
    checkIfGameWon: function () { },
};
//TODO: ^ should GameMode be a class that is extended instead of a interface, 
// cause js interfaces dont make any sense to me T:Tommi

//How to use for future users:
// - to make a new gamemode, implement above interface to new class
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

    removedFromGrid(e) {
        let gridobject = e.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            globals.incrementCollectibles();
            console.log("Score is: " + globals.collectibles.current);
            this.checkIfGameWon();
        }
    }

    checkIfGameWon() {
        if (globals.collectibles.current >= globals.collectibles.total) {
            this.eventTarget.dispatchEvent(new Event("victory"));
        }
    }

    reset() {
        globals.collectibles.current = this.startScore;
    }
}