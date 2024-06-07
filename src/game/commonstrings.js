import { Direction } from "./direction.js";

const PLAYER_STR = "player";
const TYPE_STR = "type";
const GRID_STR = "grid";
const UP_STR = "up";
const DOWN_STR = "down";
const LEFT_STR = "left";
const RIGHT_STR = "right";
const TEST_STR = "test";

export class Constants {
    static COLLECTIBLE = "collectible";
    static OBSTACLE = "obstacle";
    //Following are the valid command strings:
    static MOVE_STR = "move";
    static SAY_STR = "say";
    static ASK_STR = "ask";
    //--------------------------------

    static PYODIDE_INTERRUPT_INPUT = "pyodide_interrupt_input_666"
    static get PLAYER_STR() {
        return PLAYER_STR;
    }
    static get TYPE_STR() {
        return TYPE_STR;
    }
    static get GRID_STR() {
        return GRID_STR;
    }
    static get UP_STR() {
        return UP_STR;
    }
    static get DOWN_STR() {
        return DOWN_STR;
    }
    static get LEFT_STR() {
        return LEFT_STR;
    }
    static get RIGHT_STR() {
        return RIGHT_STR;
    }
    static get TEST_STR() {
        return TEST_STR;
    }
}

export function GetDirectionAsString(direction) {
    switch (direction) {
        case Direction.Down:
            return DOWN_STR;
        case Direction.Up:
            return UP_STR;
        case Direction.Left:
            return LEFT_STR;
        case Direction.Right:
            return RIGHT_STR;
    }
}






