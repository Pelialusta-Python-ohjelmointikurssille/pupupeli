import { Direction } from "./direction.js";

/**
 * Includes commonly used constant strings. 
 * Use this to avoid magic strings so you don't have to change every single instance of a string if you change it.
 */
export class Constants {
    //grid object types:
    static COLLECTIBLE = "collectible";
    static OBSTACLE = "obstacle";
    static EMPTY_TILE = "";
    static QUESTION_COLLECTIBLE = "question_collectible";
    //^ Add new gridObjects types above ^

    //Following are the valid command strings:
    static MOVE_STR = "move";
    static SAY_STR = "say";
    static ASK_STR = "ask";
    //--------------------------------
    static PYODIDE_INTERRUPT_INPUT = "pyodide_interrupt_input_1337" //secret string to interrupt pyodide when it's in stdin()
    static PLAYER_STR = "player";
    static TYPE_STR = "type";
    static GRID_STR = "grid";
    static TEST_STR = "test";
    //Directions
    static UP_STR = "up";
    static DOWN_STR = "down";
    static LEFT_STR = "left";
    static RIGHT_STR = "right";
}

export class ThemeNames {
    static BUNNY = "bunny";
    static ROBOT = "robot";
}

//Todo: aliases change depending on current theme
const COLLECTIBLE_ALIASES = ["porkkana", "jakoavain", "ruoka"];
const OBSTACLE_ALIASES = ["kivi", "viemäri", "este"];

/**
 * Objects in the game have different names depending on theme.
 * In game logic we have different names as well, the "true names".
 * Example, "collectible" can be "porkkana" or "jakoavain" in the game,
 * but are referred always as "collectible" in the game logic.
 * @param {*} name Name of the variable we want the true name of. True names are the constant strings used in game logic.
 * @returns The string that the variable translates into. If not found, returns false.
 */
export function getVariableTrueName(name) {
    if (COLLECTIBLE_ALIASES.includes(name))
        return Constants.COLLECTIBLE;
    if (OBSTACLE_ALIASES.includes(name))
        return Constants.OBSTACLE;
    return false;
}

export function GetDirectionAsString(direction) {
    switch (direction) {
        case Direction.Down:
            return Constants.DOWN_STR;
        case Direction.Up:
            return Constants.UP_STR;
        case Direction.Left:
            return Constants.LEFT_STR;
        case Direction.Right:
            return Constants.RIGHT_STR;
    }
}

export class TaskTypes {
    static collectibles = "collectibles"; //collect all collectables
    static instruction = "instructions"; //read instructions
    static multipleChoice = "multiple-choice"; //Choose correct answer
    static codeFixing = "code-fixing"; //Correct the code (not implemented)
    static codeBlockMoving = "code-block-moving"; //Move code blocks to finish the level
}