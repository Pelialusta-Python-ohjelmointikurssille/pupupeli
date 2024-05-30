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

    addToGrid(gridObject, x, y) {
        this.doubleArray[x][y].entities.push(gridObject);
        gridObject.cell = this.doubleArray[x][y];
    }

};