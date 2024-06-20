/**
 * GridData is given data by grid when grid logic happens. 
 * GridDatas responsibility is to update globals values to represent the current state of the grid.
 */
export class GridData {
    constructor() {
        this.goDict = {}; //GridObject dictionary, keys are GO types and values are a list of currently known GO's of that type.
    }

    remove(gridObject) {
        if (this.goDict[gridObject.type] === undefined) return;
        let index = this.goDict[gridObject.type].indexOf(gridObject);
        this.goDict[gridObject.type].splice(index, 1);
    }

    reset() {
        this.goDict = {};
    }

    add(gridObject) {
        if (this.goDict[gridObject.type] === undefined) {
            this.goDict[gridObject.type] = [];
        }
        this.goDict[gridObject.type].push(gridObject);
    }
    /**
     * 
     * @returns The number of gridobjects of given type in the game grid.
     */
    getGridObjectsOfTypeCount(type) {
        if ((this.goDict[type] === undefined)) return 0;
        return this.goDict[type].length;
    }
}