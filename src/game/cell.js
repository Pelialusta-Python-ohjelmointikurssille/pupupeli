// src/game/cell.js
export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.entities = [];
    }
    toString() {
        if (this.entities.length > 0) {
            return this.entities.toString();
        }
        return "(" + this.x + ", " + this.y + ")";
    }

    getEntities() {
        return this.entities;
    }
}
