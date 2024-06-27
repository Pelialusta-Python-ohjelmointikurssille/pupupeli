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
import { getRandomUUID } from "./uuid_generator.js";
import { Vector2 } from "./vector.js";

export class GridObject {
    constructor(type) {
        this.type = type;
        this.cell = null;
        this.id = this.#generateUniqueID();
    }
    
    #generateUniqueID() {
        return getRandomUUID();
    }

    toString() {
        return this.type;
    }

    getVector2Position() {
        if (this.cell === null | this.cell === undefined) return new Vector2(0, 0);
        return new Vector2(this.cell.x, this.cell.y);
    }
}

//TODO: Someday, remove this
// write doc for getNewGridObject
/** 
 * Creates a new GridObject with the specified name
 * @param {string} name - The name of the object
 * @returns {GridObject} - A new GridObject
 */
export function getNewGridObject(name) {
    return new GridObject(name);
}