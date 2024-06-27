import { Constants } from "./commonstrings.js";
import { collectibles, incrementCollectibles } from "../util/globals.js";

/**
 * Listens the given grids event "remove". Updates the global variable "collectibles.current" 
 * that is used to check the current collectibles in the grid.
 */
export class CollectibleCounter {
    constructor(grid) {
        this.grid = grid;
        grid.eventTarget.addEventListener("remove", this.removedFromGrid.bind(this));
    }

    /**
     * Called when something is removed from the grid.
     * Checks if it's a collectible, and updates collectibles.current.
     * @param {*} event 
     */
    removedFromGrid(event) {
        let gridobject = event.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            incrementCollectibles();
        }
    }

    /**
     * Resets collected collectibles to 0.
     */
    reset() {
        collectibles.current = 0;
    }
}