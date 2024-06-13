import { Vector2 } from "../../vector.js";

export class PawnEntityLineDrawer {
    constructor(graphics) {
        this.graphics = graphics;
        this.moveHistory = [];
        this.isEnabled = true;
    }

    onUpdatePawnEntityPosition(x, y) {
        this.moveHistory.push(new Vector2(x, y));
        if (this.moveHistory.length < 2) {
            this.graphics.moveTo(x, y);
            return;
        }
        this.graphics.lineTo(x, y);
        this.graphics.stroke({ width: 10, color: 0xff0000 });
    }

    onPawnEntityReset() {
        this.moveHistory = [];
        this.clear();
    }

    clear() {
        this.graphics.clear();
    }

    toggle() {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.graphics.alpha = 0;
        } else {
            this.isEnabled = true;
            this.graphics.alpha = 1;
        }
        console.log("is trail enabled? : " + this.isEnabled);
    }
}