export class Constants {
    static COLLECTIBLE = "collectible";
    static OBSTACLE = "obstacle";
    //Following are the valid command strings:
    static MOVE_STR = "move";
    static SAY_STR = "say";
    static ASK_STR = "ask";
    //--------------------------------
    static PYODIDE_INTERRUPT_INPUT = "pyodide_interrupt_input_666" //secret string to interrupt pyodide when it's in stdin()
    static PLAYER_STR = "player";
    static TYPE_STR = "type";
    static GRID_STR = "grid";
    static TEST_STR = "test";
}

//Todo: aliases change depending on current theme
const COLLECTIBLE_ALIASES = ["porkkana", "jakoavain"];
const OBSTACLE_ALIASES = ["kivi", "viemäri"];

/**
 * 
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






