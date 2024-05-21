export class Vector2 {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get magnitude(){
        return Math.sqrt((this.#x)**2 + (this.#y)**2);
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    SetValue(x, y){
        this.#x = x;
        this.#y = y;
    }

    DistanceTo(other) {
        return Math.sqrt((other.x-this.#x)**2 + (other.y-this.#y)**2);
    }

    ToString() {
        return `Vector2(${this.#x}, ${this.#y})`;
    }
}