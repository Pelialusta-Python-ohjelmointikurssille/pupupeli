
import { Cell } from "./cell.js";

export var grid = null;

export function initGrid(widht, height) {
    //Needs to be called first!
    //Didn't make the gamegrid a class.
    //Tutorial I was following used these export functions.
    //Refactoring later, but heard OOP isn't good for javascript(???).
    grid = CreateDoubleArray(widht, height);
    ConsoleLogGrid(grid);
}

export function moveGridObjectToDir(gridObject, x, y) {
    console.log(gridObject + " tried moving towards (" + x + ", " + y + ")");
    let newX = gridObject.cell.x + x;
    let newY = gridObject.cell.y + y;

    if (!boundaryCheck(newX, newY)) {
        console.log("...but failed.");
        return false;
    }
    removeFromGrid(gridObject);
    addToGrid(gridObject, newX, newY);
    ConsoleLogGrid(grid);
    return true;
}

export function boundaryCheck(x, y) {
    if (x < 0 | x >= grid.length) return false;
    if (y < 0 | y >= grid[0].length) return false;
    return true;
}

export function addToGrid(gridObject, x, y) {
    grid[x][y].entities.push(gridObject);
    gridObject.cell = grid[x][y];
    ConsoleLogGrid(grid);
}

export function removeFromGrid(gridObject) {
    let x = gridObject.cell.x;
    let y = gridObject.cell.y;
    let cell = grid[x][y];
    let index = cell.entities.indexOf(gridObject);
    cell.entities.splice(index, 1);
    console.log(cell.entities);
    gridObject.cell = null;
}

export function ConsoleLogGrid(grid) {
    if (grid == null) return;
    let debugStr = "";
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            debugStr += grid[x][y];
        }
        debugStr += "\n";
    }
    console.log(debugStr)
}

function CreateDoubleArray(widht, height) {
    //js doesn't have double arrays T:Tommi
    let newGrid = [];
    for (let x = 0; x < widht; x++) {
        newGrid[x] = [];
        for (let y = 0; y < height; y++) {
            newGrid[x][y] = new Cell(x, y);
        }
    }
    return newGrid;
}