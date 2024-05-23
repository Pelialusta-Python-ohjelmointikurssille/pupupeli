import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class GraphicsGrid {
    constructor (sizeOnScreen, gridSize, position, lineColor, lineWidth) {
        this.sizeOnScreen = sizeOnScreen;
        this.gridSize = gridSize;
        this.position = position;
        this.lineContainer = new PIXI.Container();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.createLines();
    }

    createLines () {
        let linexcount = this.gridSize.x + 1;
        let lineycount = this.gridSize.y + 1;
        let linexgap = this.sizeOnScreen.x / this.gridSize.x;
        let lineygap = this.sizeOnScreen.y / this.gridSize.y;
        for (let i=0; i<linexcount; i++) {
            let lineGraphics = new PIXI.Graphics()
            .rect(i*linexgap-(this.lineWidth/2), this.position.y, this.lineWidth, this.sizeOnScreen.y + this.position.y)
            .fill(this.lineColor);
            this.lineContainer.addChild(lineGraphics);
        }
        for (let i=0; i<lineycount; i++) {
            let lineGraphics = new PIXI.Graphics()
            .rect(this.position.x, i*lineygap-(this.lineWidth/2), this.sizeOnScreen.x + this.position.x, this.lineWidth)
            .fill(this.lineColor);
            this.lineContainer.addChild(lineGraphics);
        }
    }
}