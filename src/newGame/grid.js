import { getNewGameGrid } from "gridfactory.js"

class Grid {
    constructor(doubleArray, objects, location) {
        this.doubleArray = doubleArray;
        this.objects = []
    };

    // write doc for addToGrid
    /** 
     * Adds a grid object to the specified cell
     * @param {Object} gridObject - The object to add to the grid
     * @param {number} x - The x coordinate of the cell
     * @param {number} y - The y coordinate of the cell
     */
    addToGrid(gridObject, x, y) {
        this.doubleArray[x][y].entities.push(gridObject);
        gridObject.cell = this.doubleArray[x][y];
        this.objects.push(gridObject);
    }

};