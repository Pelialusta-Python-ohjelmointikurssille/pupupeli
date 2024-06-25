import { Constants } from "./commonstrings.js";
import * as globals from "../util/globals.js";

export class CollectibleCounter {
    constructor(grid) {
        this.grid = grid;
        this.onAllCollectiblesCollected = new EventTarget();
        grid.eventTarget.addEventListener("remove", this.removedFromGrid.bind(this));
    }

    removedFromGrid(event) {
        let gridobject = event.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            globals.incrementCollectibles();
            console.log("Score is: " + globals.collectibles.current);
        }
    }

    reset() {
        globals.collectibles.current = this.startScore;
    }
}