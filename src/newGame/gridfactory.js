import { getNewGridObject } from "./gridobject.js";
import { Grid } from "./grid.js";
import { Constants } from "./commonstrings.js";
<<<<<<< HEAD
import { tryGetFileAsJson } from "../file_reader.js";

export function getNewGameGrid() {
    let player = getNewGridObject(Constants.PLAYER_STR);

    let task = 1;
    const path = `../../tasks/${task}.json`;

    let result = tryGetFileAsJson(path);

    const pupucoords = result.objektit[0].koordinaatit;
    const gridSize = result.koko;

    let gridWitdh = gridSize[0];
    let gridHeight = gridSize[1];

    let xPupu = pupucoords[0];
    let yPupu = pupucoords[1];

    let pelaaja = getNewGridObject("pupu");
    let newGrid = new Grid(player, gridWitdh, gridHeight);

    newGrid.addToGrid(player, xPupu, yPupu);
    console.log(newGrid)
=======


>>>>>>> newGameLogic
    return newGrid;
};