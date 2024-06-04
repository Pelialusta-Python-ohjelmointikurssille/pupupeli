/**
 * Helper class used as a direction enum.
 * Up = 0
 * Right = 1
 * Down = 2
 * Left = 3
 */
export class Direction {
    /**
     * Number representation of the up direction.
     * @returns 0;
     */
    static get Up () {
        return 0;
    }
    /**
     * Number representation of the right direction.
     * @returns 1;
     */
    static get Right () {
        return 1;
    }
    /**
     * Number representation of the down direction.
     * @returns 2;
     */
    static get Down () {
        return 2;
    }
    /**
     * Number representation of the left direction.
     * @returns 3;
     */
    static get Left () {
        return 3;
    }
}

export function translatePythonMoveStringToDirection(pythonCommandDir) {
    switch (pythonCommandDir) {
        case "oikea":
            return Direction.Right;
        case "vasen":
            return Direction.Left;
        case "ylös":
            return Direction.Up;
        case "alas":
            return Direction.Down;
    }
}