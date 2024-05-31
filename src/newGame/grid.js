import { Vector2 } from "./vector.js";
import { Cell } from "../game/cell.js";

export class Grid {
    constructor(player, width, height) {
        this.doubleArray = this.CreateDoubleArray(width, height);
        this.gridObjects = [];
        this.width = width;
        this.height = height;
        this.player = player;
        this.resetPosMap = new Map();
    };

    saveCurrentStateForReset() {
        for (let i = 0; i < this.gridObjects.length; i++) {
            let go = this.gridObjects[i];
            this.resetPosMap.set(go, go.getVector2Position());
        }
    }

    resetGrid() {
        console.log("RESET!");
        this.doubleArray = this.CreateDoubleArray(this.width, this.height);
        for (let [gridobject, vector2] of  this.resetPosMap.entries()) {
            this.addToGrid(gridobject, vector2.x, vector2.y);
        }
        this.consoleDebug();
    }

    addToGrid(gridObject, x, y) {
        if (this.gridObjects.includes(gridObject) === false) {
            this.gridObjects.push(gridObject);
        }
        
        this.doubleArray[x][y].entities.push(gridObject);
        gridObject.cell = this.doubleArray[x][y];
    }

    //If GO unable to move to dir, returns fail.
    //Returns true if move was succesful.
    moveGridObjectToDir(gridObject, direction) {
        console.log("MOVE!");
        this.consoleDebug();
        if (gridObject == null) return false;
        let dirVector = Vector2.FromDirection(direction);
        let newX = gridObject.cell.x + dirVector.x;
        let newY = gridObject.cell.y + dirVector.y;
        if (this.boundaryCheck(newX, newY) == false) return false;
        this.removeFromGrid(gridObject);
        this.addToGrid(gridObject, newX, newY);
        return true;
    }

    boundaryCheck(x, y) {
        if (x < 0 | x >= this.doubleArray.length) return false;
        if (y < 0 | y >= this.doubleArray[0].length) return false;
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