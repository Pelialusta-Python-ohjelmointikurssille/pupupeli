// src/game/cell.js
// Write docs for cell class
/**
* Represents a cell in the game grid 
* @param {number} x - The x coordinate of the cell
* @param {number} y - The y coordinate of the cell
* @class
* @classdesc Represents a cell in the game grid
* @property {number} x - The x coordinate of the cell
* @property {number} y - The y coordinate of the cell
* @property {Array} entities - The entities in the cell
* @method toString - Returns a string representation of the cell
* @method getEntities - Returns the entities in the cell
* @returns {Cell} - A cell object
*/

export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.entities = [];
    }

    toString() {
        if (this.entities.length > 0) {
            return this.entities.toString();
        }
        return "(" + this.x + ", " + this.y + ")";
    }

    /**
     * 
     * @returns A list containing all the objects in the cell.
     */
    getEntities() {
        return this.entities;
    }
}
