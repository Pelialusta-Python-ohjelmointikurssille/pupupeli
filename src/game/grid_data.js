/**
 * GridData is given data by grid when grid logic happens. 
 * It quickly gets the amount of certain objects, and because it has data on all the objects, it can be used to get additional data in the future easily.
 */
export class GridData {
    constructor() {
        this.goDict = {}; //GridObject dictionary, keys are GO types and values are a list of currently known GO's of that type.
    }

    /**
     * @param {*} gridObject GridObject to remove from gridData
     * @returns true if able to remove that object, false if didn't find
     */
    remove(gridObject) {
        if (this.goDict[gridObject.type] === undefined) return false;
        let index = this.goDict[gridObject.type].indexOf(gridObject);
        this.goDict[gridObject.type].splice(index, 1);
        return true;
    }

    /**
     * Removes all data.
     */
    reset() {
        this.goDict = {};
    }

    /**
     * Adds a gridobject, it adds it to a dictionary where it's key is it's type.
     * @param {*} gridObject 
     */
    add(gridObject) {
        if (this.goDict[gridObject.type] === undefined) {
            this.goDict[gridObject.type] = [];
        }
        this.goDict[gridObject.type].push(gridObject);
    }
    /**
     * @returns The number of gridobjects of given type in the game grid.
     */
    getGridObjectsOfTypeCount(type) {
        if ((this.goDict[type] === undefined)) return 0;
        return this.goDict[type].length;
    }
}