export class Grid {
    constructor(doubleArray) {
        this.doubleArray = doubleArray;
        this.objects = []
    };

    getWidth() {
        return this.doubleArray.length;
    }

    getHeight() {
        return this.doubleArray[0].length;
    }

    // write doc for addToGrid
    /** 
     * Adds a grid object to the specified cell
     * @param {Object} gridObject - The object to add to the grid
     * @param {number} x - The x coordinate of the cell
     * @param {number} y - The y coordinate of the cell
     */
    addToGrid(gridObject, x, y) {
        this.doubleArray[x][y] = gridObject;
        this.objects.push(gridObject);
    }

};