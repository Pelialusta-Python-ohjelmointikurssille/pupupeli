// src/game/cell.js
class Cell {
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

module.exports = { Cell };
