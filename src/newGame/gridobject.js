// write doc for gridObject
/**
 * Represents an object that can be placed on the grid
 * @class
 * @classdesc Represents an object that can be placed on the grid
 * @property {string} name - The name of the object
 * @property {Cell} cell - The cell the object is in
 * @method toString - Returns a string representation of the object
 * @returns {GridObject} - A grid object
 */

import { Vector2 } from "./vector.js";

class GridObject {
    constructor(type) {
        this.type = type;
        this.cell = null;
        this.id = this.#generateUniqueID();
        console.log(this.id);
    }

    #generateUniqueID() {
        return crypto.randomUUID().toString();
    }

    toString() {
        return this.type;
    }

    getVector2Position() {
        if (this.cell === null | this.cell === undefined) return new Vector2(0, 0);
        return new Vector2(this.cell.x, this.cell.y);
    }
}

// write doc for getNewGridObject
/** 
 * Creates a new GridObject with the specified name
 * @param {string} name - The name of the object
 * @returns {GridObject} - A new GridObject
 */
export function getNewGridObject(name) {
    return new GridObject(name);
}