import { Vector2 } from "../../vector.js";
import { GraphicsEntity } from "./graphics_entity.js";
import { Constants } from "../../commonstrings.js";
import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";

export class GridObjectEntity extends GraphicsEntity {
    constructor(entityId, entityHandler, container, sprite, data) {
        super(entityId, entityHandler, container, sprite, data);
        this.gridReference = entityHandler.getMainGridObject();
        this.gridCellPosition = new Vector2(0, 0);
        this.sizeWithinCellMultiplier = 0.9;
        this.fakeZPosition = 0;
        this.currentAnimation = null;
        this.usesTrail = true;
        this.type = "grid_object";
        if (data != null) {
            if (data.position != null) {
                this.gridCellPosition = data.position;
            }
        }
        if (this.usesTrail === true) {
            this.realPath = new PIXI.Graphics();
            this.realPath.moveTo(0, 0);
            this.realPath.lineTo(100, 200);
            this.realPath.lineTo(200, 200);
            this.realPath.lineTo(240, 100);
            this.realPath.stroke({ width: 2, color: 0xffffff });

            this.realPath.position.x = 50;
            this.realPath.position.y = 50;

            this.container.addChild(this.realPath);
        }
        this.startPosition = new Vector2(this.gridCellPosition.x, this.gridCellPosition.y);
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.dirTexMap = new Map();
    }

    onCreate() {
        super.onCreate();
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
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
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
    }

    reset() {
        super.reset();
        this.gridCellPosition = new Vector2(this.startPosition.x, this.startPosition.y);
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridCellPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y;
    }

    /**
     * 
     * @param {*} textures Expects following object: { down: tex_down, right: tex_right, left: tex_left, up: tex_up }
     */
    setDirectionTextures(textures) {
        this.dirTexMap.set(Constants.DOWN_STR, textures.down);
        this.dirTexMap.set(Constants.UP_STR, textures.up);
        this.dirTexMap.set(Constants.LEFT_STR, textures.left);
        this.dirTexMap.set(Constants.RIGHT_STR, textures.right);
    }

    swapTextureToMoveDir(dir) {
        let tex = this.dirTexMap.get(dir);
        if (tex !== undefined) {
            this.sprite.texture = this.dirTexMap.get(dir);
        }
    }

}