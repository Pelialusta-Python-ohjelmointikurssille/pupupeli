import { GraphicsEntity } from "../graphics_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class TextBoxEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, entityData, skins) {
        super(entityId, entityHandler, container, sprite, entityData, skins);
        this.lineGraphic = new PIXI.Graphics();
        this.targetPosition = null;
        this.textContent = "";
        this.alignTextTop = false;
        this.textObject = new PIXI.Text({ text: "", style: { fontFamily: "Roboto Light", fontSize: 32, fill : 0x000000 } });       
        this.container.addChild(this.lineGraphic);
        this.container.addChild(this.textObject);
        this.useWorldCoordinates = true;
    }

    applyEntityData() {
        super.applyEntityData();
        if (this.entityData.text != null) {
            this.textContent = this.entityData.text;
            this.textObject.text = this.textContent;
        }
        if (this.entityData.targetPosition != null) {
            this.targetPosition = this.entityData.targetPosition;
        }
        if (this.entityData.size == null) {
            this.sprite.width = this.textObject.width + 64;
            this.sprite.height = this.textObject.height + 64;
        }
        if (this.entityData.textColor != null) {
            this.textObject.style.fill = this.entityData.textColor;
        }
        if (this.entityData.fontSize != null) {
            this.textObject.style.fontSize = this.entityData.fontSize;
        }
        if (this.entityData.font != null) {
            this.textObject.style.fontFamily = this.entityData.font;
        }
        if (this.entityData.alignTextTop != null) {
            this.alignTextTop = this.entityData.alignTextTop;
        }
        console.log(this.entityData.useWorldCoordinates)
        if (this.entityData.useWorldCoordinates != null) {
            this.useWorldCoordinates = this.entityData.useWorldCoordinates;
        }
    }

    onCreate() {
        super.onCreate();
        this.initTextObject();
        this.initBoxSprite();
        if (this.targetPosition != null) {
            this.setDynamicallyPosition();
            //this.createTargetArrow();
        }
    }

    initTextObject() {
        this.textObject.anchor.set(0.5);
        if (this.alignTextTop) {
            this.textObject.position.y = -(this.sprite.height / 2) + this.textObject.height;
        }
    }

    initBoxSprite() {
        this.sprite.leftWidth = 64;
        this.sprite.topHeight = 64;
        this.sprite.rightWidth = 64;
        this.sprite.bottomHeight = 64;
        this.sprite.pivot.x = this.sprite.width / 2;
        this.sprite.pivot.y = this.sprite.height / 2;
        this.container.pivot.x = 0;
        this.container.pivot.y = 0;
    }

    createTargetArrow() {
        let triWidth = this.sprite.width / 50 + 20;
        let path = [
            -triWidth, 0,
            triWidth, 0,
            (this.targetPosition.x - this.container.x) * 0.8, (this.targetPosition.y - this.container.y) * 0.8,
            -triWidth, 0
        ]
        
        this.lineGraphic.poly(path);
        this.lineGraphic.fill(0xffffff);
    }

    setDynamicallyPosition() {
        if (this.entityData.position != null) {
            this.container.x = this.entityData.position.x;
            this.container.y = this.entityData.position.y;
        } else if (this.entityData.targetPosition != null){
            if (this.targetPosition.x >= 512){
                this.container.x = this.targetPosition.x - (this.sprite.width / 2 + 64);
            }
            else {
                this.container.x = this.targetPosition.x + (this.sprite.width / 2 + 64);
            }
            if (this.targetPosition.y >= 512){
                this.container.y = this.targetPosition.y - (this.sprite.height / 2 + 64);
            }
            else {
                this.container.y = this.targetPosition.y + (this.sprite.height / 2 + 64);
            }
        }
    }
}