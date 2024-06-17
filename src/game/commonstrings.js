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
    //Directions
    static UP_STR = "up";
    static DOWN_STR = "down";
    static LEFT_STR = "left";
    static RIGHT_STR = "right";
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
