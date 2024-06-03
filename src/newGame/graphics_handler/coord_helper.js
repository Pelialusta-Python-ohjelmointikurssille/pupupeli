import { Vector2 } from "../../newGame/vector.js";

/**
 * Returns screen space coordinates of a given grid cell. Coordinates are of
 * the cell center.
 * @param {*} cellX X-coordinate of the cell's transform
 * @param {*} cellY Y-coordinate of the cell's transform
 * @param {*} gridWidth Width of the grid in pixels
 * @param {*} gridHeight Height of the grid in pixels
 * @param {*} columns Number of columns in the grid
 * @param {*} rows Number of rows in the grid
 * @param {*} xOffset X-offset of the grid from origin in pixels
 * @param {*} yOffset Y-offset of the grid from origin in pixels
 */
export function GridSpaceToScreenSpace(cellX, cellY, gridWidth, gridHeight, columns, rows, xOffset=0, yOffset=0) {
    let cellWidth = gridWidth / columns;
    let cellHeight = gridHeight / rows;
    let screenX = (cellWidth * cellX) + (cellWidth / 2) + xOffset;
    let screenY = (cellHeight * cellY) + (cellHeight / 2) + yOffset;
    let screenCoordinates = [Number, Number];
    screenCoordinates = [screenX, screenY];
    return screenCoordinates;
}

export function GridVectorToScreenVector(cellVector, gridScreenSizeVector, gridSizeVector, offsetVector=new Vector2(0, 0)) {
    let screenCoordinates = GridSpaceToScreenSpace(
        cellVector.x,
        cellVector.y,
        gridScreenSizeVector.x,
        gridScreenSizeVector.y,
        gridSizeVector.x,
        gridSizeVector.y,
        offsetVector.x,
        offsetVector.y
    );
    return new Vector2(screenCoordinates[0], screenCoordinates[1]);
}

/**
 * Returns grid coordinates from specific screen space coordinates. Screen space coordinates
 * are of the center of the grid cell.
 * @param {*} screenX X-coordinate on screen in pixels
 * @param {*} screenY Y-coordinate on screen in pixels
 * @param {*} gridWidth Width of the grid in pixels 
 * @param {*} gridHeight Height of the grid in pixels
 * @param {*} columns Number of columns in grid
 * @param {*} rows Number of rows in grid
 * @param {*} xOffset X-offset of grid from origin in pixels
 * @param {*} yOffset Y-offset of grid from origin in pixels
 */
export function ScreenSpaceToGridSpace(screenX, screenY, gridWidth, gridHeight, columns, rows, xOffset=0, yOffset=0) {
    let cellWidth = gridWidth / columns;
    let cellHeight = gridHeight / rows;
    let cellX = (screenX - (cellWidth / 2)) / cellWidth + xOffset;
    let cellY = (screenY - (cellHeight / 2)) / cellHeight + yOffset;
    let gridCoordinates = [Number, Number];
    gridCoordinates = [cellX, cellY];
    return gridCoordinates;
}
