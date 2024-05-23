import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class GraphicsGrid {
    constructor (sizeOnScreen, gridSize, position, lineColor, lineWidth, font) {
        this.sizeOnScreen = sizeOnScreen;
        this.gridSize = gridSize;
        this.position = position;
        this.lineContainer = new PIXI.Container();
        this.lineGraphicsList =  [];
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.lineGraphics = new PIXI.Graphics()
        this.font = font;
    }

    createLines () {
        let linexcount = this.gridSize.x + 1;
        let lineycount = this.gridSize.y + 1;
        let linexgap = this.sizeOnScreen.x / this.gridSize.x;
        let lineygap = this.sizeOnScreen.y / this.gridSize.y;
        for (let i=0; i<linexcount; i++) {
            this.lineGraphics
            .rect(i*linexgap-(this.lineWidth/2), this.position.y, this.lineWidth, this.sizeOnScreen.y + this.position.y)
            .fill({color: this.lineColor});
            let textObject = new PIXI.Text({ text: `${i}`, style: { fontFamily: this.font, fontSize: 16, fill : this.lineColor } });
            textObject.x = i*linexgap + (linexgap / 2);
            textObject.y = 4;
            textObject.anchor.set(0.5, 0);
            this.lineContainer.addChild(textObject);
        }
        for (let i=0; i<lineycount; i++) {
            this.lineGraphics
            .rect(this.position.x, i*lineygap-(this.lineWidth/2), this.sizeOnScreen.x + this.position.x, this.lineWidth)
            .fill({color: this.lineColor});
            let textObject = new PIXI.Text({ text: `${i}`, style: { fontFamily: this.font, fontSize: 16, fill : this.lineColor } });
            textObject.x = 4;
            textObject.y = i*lineygap + (lineygap / 2);
            textObject.anchor.set(0, 0.5);
            this.lineContainer.addChild(textObject);
        }
        this.lineContainer.addChild(this.lineGraphics);
    }

    removeLines () {
        this.lineGraphics.clear();
        this.lineContainer.removeChildren();
    }
}