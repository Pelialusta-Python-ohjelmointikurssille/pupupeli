import { GraphicsEntity } from "../graphics_entity.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class TextBoxEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data, texture, skins) {
        super(entityId, entityHandler, container, sprite, data, skins);
        this.textboxSprite = new PIXI.NineSliceSprite({
            texture: texture,
            leftWidth: 64,
            topHeight: 64,
            rightWidth: 64,
            bottomHeight: 64,
        });

        this.lineGraphic = new PIXI.Graphics();

        this.textObject = new PIXI.Text({ text: "", style: { fontFamily: "Roboto Light", fontSize: 32, fill : 0x000000 } });       
        this.initTextObject();
        this.initBoxSprite();
        this.container.addChild(this.lineGraphic);
        this.container.addChild(this.textboxSprite);
        this.container.addChild(this.textObject);
        
        this.setDynamicallyPosition();
        
        if (this.targetPosition != null) {
            this.createTargetArrow();
        }
    }

    initTextObject() {
        this.textObject.anchor.set(0.5);
        this.textContent = "";
        if (this.data.text != null) {
            this.textContent = this.data.text;
        }
        this.textObject.text = this.textContent;

        if (this.data.size != null) {
            this.textboxSprite.width = this.data.size.x;
            this.textboxSprite.height = this.data.size.y;
        } else {
            this.textboxSprite.width = this.textObject.width + 64;
            this.textboxSprite.height = this.textObject.height + 64;
        }

        this.targetPosition = null;
        if (this.data.targetPosition != null) {
            this.targetPosition = this.data.targetPosition;
        }
    }

    initBoxSprite() {
        this.textboxSprite.pivot.x = this.textboxSprite.width / 2;
        this.textboxSprite.pivot.y = this.textboxSprite.height / 2;
        this.container.pivot.x = 0;
        this.container.pivot.y = 0;
    }

    createTargetArrow() {
        let triWidth = this.textboxSprite.width / 10 + 20;
        let path = [
            -triWidth, 0,
            triWidth, 0,
            (this.targetPosition.x - this.container.x) * 0.8, (this.targetPosition.y - this.container.y) * 0.8,
            -triWidth, 0
        ]
        
        this.lineGraphic.poly(path);
        this.lineGraphic.fill(0xffffff);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
    }

    onStartAnimation(name) {
        super.onStartAnimation(name);
    }

    onFinishAnimation(name) {
        super.onFinishAnimation(name);
    }

    doAnimation(animation) {
        super.doAnimation(animation);
    }

    finishAnimationsInstantly() {
        super.finishAnimationsInstantly();
    }

    setDynamicallyPosition() {
        if (this.data.position != null) {
            this.container.x = this.data.position.x;
            this.container.y = this.data.position.y;
        } else if (this.data.targetPosition != null){
            if (this.targetPosition.x >= 512){
                this.container.x = this.targetPosition.x - (this.textboxSprite.width / 2 + 64);
            }
            else {
                this.container.x = this.targetPosition.x + (this.textboxSprite.width / 2 + 64);
            }
            if (this.targetPosition.y >= 512){
                this.container.y = this.targetPosition.y - (this.textboxSprite.height / 2 + 64);
            }
            else {
                this.container.y = this.targetPosition.y + (this.textboxSprite.height / 2 + 64);
            }
        }
    }
}