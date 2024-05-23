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
}