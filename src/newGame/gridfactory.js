import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { tryGetFileAsJson } from "../file_reader.js";

export function getNewGameGrid() {
    let task = 1;
    const path = `../../tasks/${task}.json`;
    // const fileReadMessage = tryGetFileAsText(path);
    // const text = fileReadMessage.result;

    let result = tryGetFileAsJson(path);

    const pupucoords = result.objektit[0].koordinaatit;

    let x = pupucoords[0];
    let y = pupucoords[1];

    let pelaaja = getNewGridObject("pupu");
    let newGrid = new Grid(pelaaja, 8, 8);
    
    newGrid.addToGrid(pelaaja, x, y);
    console.log(newGrid)
    return newGrid;
};