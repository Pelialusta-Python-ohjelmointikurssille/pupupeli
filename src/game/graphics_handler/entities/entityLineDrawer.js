import { Vector2 } from "../../vector.js";

export class PawnEntityLineDrawer {
    constructor(graphics) {
        this.graphics = graphics;
        this.moveHistory = [];
    }
    onUpdatePawnEntityPosition(x, y) {
        this.moveHistory.push(new Vector2(x, y));
        if (this.moveHistory.length < 2) {
            this.graphics.moveTo(x, y);
            return;
        }
        this.graphics.lineTo(x, y);
        this.graphics.stroke({ width: 2, color: 0xffffff });
    }
}