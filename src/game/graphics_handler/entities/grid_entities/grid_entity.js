import { GraphicsEntity } from "../graphics_entity.js";
import { Vector2 } from "../../../vector.js";
import { GridVectorToScreenVector } from "../../coord_helper.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

/**
 * Entity responsible for displaying the in-game grid and managing grid coordinates for pawns. 
 * Pawn entities use this object to position themselves correctly on screen.
 */
export class GridEntity extends GraphicsEntity {
    /**
     * 
     * @param {*} entityUUID A unique ID used identify the object. For example, this is used to refer to the entity when calling it to do an animation. 
     * @param {*} entityHandler A reference to the entity handler that created it.
     * @param {*} pixiContainer A PixiJS container object that is added to pixiJS stage. All graphics should be children of this container.
     * @param {*} sprite A PixiJS sprite object.
     * @param {*} entityData An entityDate object. Contains optional override parameters when this object is created.
     * @param {*} skins An array of EntitySkin objects. A list of available skins for the entity. Used also when switching themes.
     */
    constructor(entityUUID, entityHandler, container, sprite, entityData, skins) {
        super(entityUUID, entityHandler, container, sprite, entityData, skins);
        this.lineGraphics = new PIXI.Graphics()
        this.lineGraphicsList =  [];
        this.lineColor = 0x000000;
        this.lineWidth = 2;
        this.fontSize = 32;
        this.font = "Roboto Light";
        this.gridSize = new Vector2(4, 4);
        this.areLinesEnabled = true;
        this.pixelSize = new Vector2(this.gridSize.x * 128, this.gridSize.y * 128);
        this.gridScale = this.pixelSize.x / this.gridSize.x;
    }

    /**
     * Called when onCreate is called. Handles setting override variables if given using entityData.
     * Extended from base class.
     */
    applyEntityData() {
        super.applyEntityData();
        if (this.entityData.gridSize != null) {
            this.gridSize = this.entityData.gridSize;
        }
        if (this.entityData.areLinesEnabled != null) {
            this.areLinesEnabled = this.entityData.areLinesEnabled;
        }
        if (this.entityData.lineColor != null) {
            this.lineColor = this.entityData.lineColor;
        }
        if (this.entityData.lineWidth != null) {
            this.lineWidth = this.entityData.lineWidth;
        }
        if (this.entityData.font != null) {
            this.font = this.entityData.font;
        }
        if (this.entityData.fontSize != null) {
            this.fontSize = this.entityData.fontSize;
        }
    }
    
    /**
     * Called when the entity is created by the GraphicsEntityHandler.
     * Extended from base class.
     */
    onCreate() {
        super.onCreate();
        this.pixelSize = new Vector2(this.gridSize.x * 128, this.gridSize.y * 128);
        this.gridScale = this.pixelSize.x / this.gridSize.x;
        this.createLines();
    }

    /**
     * Creates all grid lines based on position, number of cells and so on.
     * The lines are currently pixi graphics rectangles.
     * Should be changed to actual lines.
     */
    createLines () {
        this.areLinesEnabled = true;
        let linexcount = this.gridSize.x + 1;
        let lineycount = this.gridSize.y + 1;
        let linexgap = this.pixelSize.x / this.gridSize.x;
        let lineygap = this.pixelSize.y / this.gridSize.y;
        for (let i=0; i<linexcount; i++) {
            this.lineGraphics
            .rect(i*linexgap-(this.lineWidth/2), 0, this.lineWidth, this.pixelSize.y)
            .fill({color: this.lineColor});
            if (i == linexcount-1) continue;
            let textObject = new PIXI.Text({ text: `${i+1}`, style: { fontFamily: this.font, fontSize: this.fontSize, fill : this.lineColor } });
            textObject.x = i*linexgap + (linexgap / 2);
            textObject.y = 4;
            textObject.anchor.set(0.5, 0);
            this.container.addChild(textObject);
        }
        for (let i=0; i<lineycount; i++) {
            this.lineGraphics
            .rect(0, i*lineygap-(this.lineWidth/2), this.pixelSize.x, this.lineWidth)
            .fill({color: this.lineColor});
            if (i == lineycount-1) continue;
            let textObject = new PIXI.Text({ text: `${i+1}`, style: { fontFamily: this.font, fontSize: 32, fill : this.lineColor } });
            textObject.x = 4;
            textObject.y = i*lineygap + (lineygap / 2);
            textObject.anchor.set(0, 0.5);
            this.container.addChild(textObject);
        }
        this.container.addChild(this.lineGraphics);
    }

    /**
     * Destroy lines, used to hide lines.
     */
    removeLines () {
        this.areLinesEnabled = false;
        this.lineGraphics.clear();
        this.container.removeChildren();
    }

    /**
     * Transforms given grid coordinates to screen coordinates. Used by pawn entities to position correctly.
     * @param {Vector2} gridCellPosition Cell osition within grid.
     * @returns A Vector2 of the screen position of the given cell position.
     */
    gridToScreenCoordinates(gridCellPosition) {
        let screenPos = GridVectorToScreenVector(gridCellPosition, this.pixelSize, this.gridSize, new Vector2(this.container.x, this.container.y));
        return screenPos;
    }

    getMiddlePixelPosition() {
        return new Vector2(this.pixelSize.x / 2 + this.container.position.x, this.pixelSize.y / 2 + this.container.position.y);
    }
}