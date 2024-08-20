import { Vector2 } from "../../vector.js";

export class PawnEntityLineDrawer {
    constructor(graphics) {
        this.graphics = graphics;
        this.moveHistory = [];
        this.isEnabled = this.lineStateInit();
        if (this.isEnabled) {
            this.graphics.alpha = 1;
        } else {
            this.graphics.alpha = 0;
        }
        this.trailToggleButton = document.getElementById("trail-toggle-button");
        this.trailToggleButton.checked = this.isEnabled;
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
            localStorage.setItem("lineState", "false");
            this.graphics.alpha = 0;
        } else {
            this.isEnabled = true;
            localStorage.setItem("lineState", "true");
            this.graphics.alpha = 1;
        }
        this.trailToggleButton.checked = this.isEnabled;
    }

    lineStateInit() {
        const lineState = localStorage.getItem("lineState");
        if (lineState === "true") {
            return true;
        }
        return false;
    }
}