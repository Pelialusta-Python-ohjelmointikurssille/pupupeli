import { Constants } from "./commonstrings.js";
import { collectibles, incrementCollectibles } from "../util/globals.js";

export class CollectibleCounter {
    constructor(grid) {
        this.grid = grid;
        grid.eventTarget.addEventListener("remove", this.removedFromGrid.bind(this));
    }

    removedFromGrid(event) {
        let gridobject = event.detail;
        if (gridobject.type === Constants.COLLECTIBLE) {
            incrementCollectibles();
            console.log("Score is: " + collectibles.current);
        }
    }

    reset() {
        collectibles.current = 0;
    }
}