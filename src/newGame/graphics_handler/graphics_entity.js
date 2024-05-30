import { Vector2 } from "../../game/vector.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, size) {
        this.entityId = entityId;
        this.entityHandler = entityHandler;
        this.container = container;
        this.sprite = sprite;

        this.sizeOnScreen = new Vector2(640, 640)
        this.lineGraphicsList =  [];
        this.lineColor = 0x000000;
        this.lineWidth = 2;
        this.lineGraphics = new PIXI.Graphics()
        this.font = "Roboto";
        this.gridSize = size;
    }

    onCreate() {
        this.sprite.width = 64;
        this.sprite.height = 64;
        this.createLines();
    }

    onDestroy() {

    }

    onUpdate(deltaTime) {
        
    }

    doAnimation() {

    }

    createLines () {
        let linexcount = this.gridSize.x + 1;
        let lineycount = this.gridSize.y + 1;
        let linexgap = this.sizeOnScreen.x / this.gridSize.x;
        let lineygap = this.sizeOnScreen.y / this.gridSize.y;
        for (let i=0; i<linexcount; i++) {
            this.lineGraphics
            .rect(i*linexgap-(this.lineWidth/2), 0, this.lineWidth, this.sizeOnScreen.y)
            .fill({color: this.lineColor});
            if (i == linexcount-1) continue;
            let textObject = new PIXI.Text({ text: `${i+1}`, style: { fontFamily: this.font, fontSize: 16, fill : this.lineColor } });
            textObject.x = i*linexgap + (linexgap / 2);
            textObject.y = 4;
            textObject.anchor.set(0.5, 0);
            this.container.addChild(textObject);
        }
        for (let i=0; i<lineycount; i++) {
            this.lineGraphics
            .rect(0, i*lineygap-(this.lineWidth/2), this.sizeOnScreen.x, this.lineWidth)
            .fill({color: this.lineColor});
            if (i == lineycount-1) continue;
            let textObject = new PIXI.Text({ text: `${i+1}`, style: { fontFamily: this.font, fontSize: 16, fill : this.lineColor } });
            textObject.x = 4;
            textObject.y = i*lineygap + (lineygap / 2);
            textObject.anchor.set(0, 0.5);
            this.container.addChild(textObject);
        }
        this.container.addChild(this.lineGraphics);
    }

    removeLines () {
        this.lineGraphics.clear();
        this.container.removeChildren();
    }
}