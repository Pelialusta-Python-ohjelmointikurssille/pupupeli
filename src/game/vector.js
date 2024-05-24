/**
 * Helper class used for creating and using 2D vectors.
 * Used for example directions and points.
 */
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the length of the vector.
     */
    get magnitude(){
        return Math.sqrt((this.x)**2 + (this.y)**2);
    }

    /**
     * Used to set both component values at the same time.
     * @param {*} x The x-component of the vector.
     * @param {*} y The y-component of the vector.
     */
    SetValue(x, y){
        this.x = x;
        this.y = y;
    }

    /**
     * Used to get the distance to another Vector2 point.
     * @param {*} other The other Vector2 object.
     * @returns Distance between points.
     */
    DistanceTo(other) {
        return Math.sqrt((other.x-this.x)**2 + (other.y-this.y)**2);
    }

    /**
     * Returns a string representations of the Vector2 object.
     * @returns string 
     */
    ToString() {
        return `Vector2(${this.x}, ${this.y})`;
    }

    /**
     * Used to multiply the vector by a given value.
     * Useful for scaling the length of the vector.
     * @param {*} multiplier The number to multiply by.
     * @returns A new Vector2 object with new multiplied values.
     */
    MultipliedBy(multiplier) {
        return new Vector2(this.x * multiplier, this.y * multiplier);
    }

    /**
     * Returns a unit vector from a given direction object/enum.
     * @param {*} direction A direction enum to be transformed.
     * @returns A Vector2 object with length of 1.
     * NOTE: y-component is flipped (-1 is up, 1 is down)
     * as that is how PixiJS treats screen coordinates.
     */
    static FromDirection(direction) {
        // Uses values from direction.js
        // DO NOT CHANGE!!!!!
        switch(direction){
            case 0:
                return new Vector2(0, -1);
            case 1:
                return new Vector2(1, 0);
            case 2:
                return new Vector2(0, 1);
            case 3:
                return new Vector2(-1, 0);
        }
    }
}