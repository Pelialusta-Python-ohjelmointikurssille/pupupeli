export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude(){
        return Math.sqrt((this.x)**2 + (this.y)**2);
    }

    SetValue(x, y){
        this.x = x;
        this.y = y;
    }

    DistanceTo(other) {
        return Math.sqrt((other.x-this.x)**2 + (other.y-this.y)**2);
    }

    ToString() {
        return `Vector2(${this.x}, ${this.y})`;
    }

    MultipliedBy(multiplier) {
        return new Vector2(this.x * multiplier, this.y * multiplier);
    }

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