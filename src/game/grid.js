import { Vector2 } from "./vector.js";
import { Cell } from "./cell.js";
import { Constants } from "./commonstrings.js";


/**
 * Represents the game grid
 * @class
 * @classdesc Represents the game grid
 * @property {string} doublearray - game grid as a double array
 * @property {array} gridObjects - array where grid objects get pushed when addToGrid is called
 * @property {number} width - width of grid
 * @property {number} height - height of grid
 * @property {GridObject} player - grid object of type "player" with position data in cell
 * @property {Map} resetPosMap - map of starting positions of grid objects (player, collectibles, obstacles...)
 * @returns {Grid} - A grid of given width and height with player gridObject placed
 */
export class Grid {
    constructor(player, width, height) {
        this.doubleArray = this.CreateDoubleArray(width, height);
        this.gridObjects = [];
        this.width = width;
        this.height = height;
        this.player = player;
        this.resetPosMap = new Map();
    };

    /**
     * Saves the starting positions of grid objects
     */
    saveCurrentStateForReset() {
        for (let i = 0; i < this.gridObjects.length; i++) {
            let go = this.gridObjects[i];
            this.resetPosMap.set(go, go.getVector2Position());
        }
    }

    /**
     * Resets grid objects to starting positions by creating a new double array
     */
    resetGrid() {
        this.doubleArray = this.CreateDoubleArray(this.width, this.height);
        for (let [gridobject, vector2] of this.resetPosMap.entries()) {
            this.addToGrid(gridobject, vector2.x, vector2.y);
        }
    }

    /**
     * 
     */
    addToGrid(gridObject, x, y) {
        if (this.gridObjects.includes(gridObject) === false) {
            this.gridObjects.push(gridObject);
        }

        this.doubleArray[x][y].entities.push(gridObject);
        gridObject.cell = this.doubleArray[x][y];
    }

    /**
     * Checks if player can move to given direction
     * @param {GridObject} gridObject 
     * @param {Direction} direction enum in direction.js
     * @returns {boolean} true if can move, false if cannot
     */
    moveGridObjectToDir(gridObject, direction) {
        if (gridObject == null) return false;
        let dirVector = Vector2.FromDirection(direction);
        let newX = gridObject.cell.x + dirVector.x;
        let newY = gridObject.cell.y + dirVector.y;
        if (this.boundaryCheck(newX, newY) == false) return false;
        if (this.obstacleCheck(newX, newY) == false) return false;
        this.removeFromGrid(gridObject);
        this.addToGrid(gridObject, newX, newY);
        return true;
    }

    /**
     * returns array of entities of the Cell at x, y position in grid
     * @param {number} x 
     * @param {number} y 
     * @returns {array} Cell.entities
     */
    getObjectsAtGridPosition(x, y) {
        return this.doubleArray[x][y].entities;
    }

    /**
     * Returns array of entities of adjacent Cell in given direction 
     * @param {number} posX 
     * @param {number} posY 
     * @param {Direction} direction enum in direction.js
     * @returns {array} Cell.entities
     */
    getAdjacentObjectsAtDir(posX, posY, direction) {
        let dirVector = Vector2.FromDirection(direction);
        posX += dirVector.x;
        posY += dirVector.y;
        return this.getObjectsAtGridPosition(posX, posY);
    }

    boundaryCheck(x, y) {
        if (x < 0 | x >= this.doubleArray.length) return false;
        if (y < 0 | y >= this.doubleArray[0].length) return false;
        return true;
    }

    obstacleCheck(x, y) {
        for (let i = 0; i < this.doubleArray[x][y].entities.length; i++) {
            if (this.doubleArray[x][y].entities[i].type === Constants.OBSTACLE) {
                return false;
            }
        }
        return true;
    }

    removeFromGrid(gridObject) {
        let x = gridObject.cell.x;
        let y = gridObject.cell.y;
        let cell = this.doubleArray[x][y];
        let index = cell.entities.indexOf(gridObject);
        cell.entities.splice(index, 1);
        gridObject.cell = null;
    }

    CreateDoubleArray(width, height) {
        //js doesn't have double arrays T:Tommi
        let newDoubleArray = [];
        for (let x = 0; x < width; x++) {
            newDoubleArray[x] = [];
            for (let y = 0; y < height; y++) {
                newDoubleArray[x][y] = new Cell(x, y);
            }
        }
        return newDoubleArray;
    }

    consoleDebug() {
        this.consoleDebugDoubleArray(this.doubleArray);
    }

    consoleDebugDoubleArray(doubleArray) {
        for (let x = 0; x < doubleArray.length; x++) {
            let row = "";
            for (let y = 0; y < doubleArray[0].length; y++) {
                row += doubleArray[y][x] + ", ";
            }
            console.log(row + "\n");
        }
    }

};