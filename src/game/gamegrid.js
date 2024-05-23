
import { Cell } from "./cell.js";

export var grid = null;

// write doc for initGrid
/** 
 * Initializes the game grid with the specified dimensions
 * @param {number} width - The width of the grid
 * @param {number} height - The height of the grid
 */
export function initGrid(widht, height) {
    //Needs to be called first!
    //Didn't make the gamegrid a class.
    //Tutorial I was following used these export functions.
    //Refactoring later, but heard OOP isn't good for javascript(???).
    grid = CreateDoubleArray(widht, height);
}

// write doc for moveGridObjectToDir
/** 
 * Moves a grid object in the specified direction
 * @param {Object} gridObject - The object to move
 * @param {number} x - The x direction to move
 * @param {number} y - The y direction to move
 * @returns {boolean} - True if the object was moved, false if it was not
 */
export function moveGridObjectToDir(gridObject, x, y) {
    let newX = gridObject.cell.x + x;
    let newY = gridObject.cell.y + y;

    removeFromGrid(gridObject);
    addToGrid(gridObject, newX, newY);
    return true;
}

// write doc for boundaryCheck
/** 
 * Checks if the specified coordinates are within the grid bounds
 * @param {number} x - The x coordinate to check
 * @param {number} y - The y coordinate to check
 * @returns {boolean} - True if the coordinates are within bounds, false if they are not
 */
export function boundaryCheck(x, y) {
    if (x < 0 | x >= grid.length) return false;
    if (y < 0 | y >= grid[0].length) return false;
    return true;
}

// write doc for addToGrid
/** 
 * Adds a grid object to the specified cell
 * @param {Object} gridObject - The object to add to the grid
 * @param {number} x - The x coordinate of the cell
 * @param {number} y - The y coordinate of the cell
 */
export function addToGrid(gridObject, x, y) {
    grid[x][y].entities.push(gridObject);
    gridObject.cell = grid[x][y];
}

// write doc for removeFromGrid
/** 
 * Removes a grid object from the grid
 * @param {Object} gridObject - The object to remove from the grid
 */
export function removeFromGrid(gridObject) {
    let x = gridObject.cell.x;
    let y = gridObject.cell.y;
    let cell = grid[x][y];
    let index = cell.entities.indexOf(gridObject);
    cell.entities.splice(index, 1);
    gridObject.cell = null;
}

// write doc for CreateDoubleArray
/** 
 * Creates a double array with the specified dimensions
 * @param {number} width - The width of the array
 * @param {number} height - The height of the array
 * @returns {Array} - The double array
 */
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