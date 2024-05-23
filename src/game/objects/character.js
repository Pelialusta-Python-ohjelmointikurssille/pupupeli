import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { Vector2 } from "../vector.js";
import { Direction } from "../direction.js"
import { GridVectorToScreenVector } from "../coord_helper.js";

export class Character {
    constructor (gridPosition, textures, size) {
        this.gridPosition = gridPosition;
        this.screenPosition = this.getScreenPosition(this.gridPosition);
        this.direction = Direction.Right;
        this.textures = textures;
        this.renderSprite = new PIXI.Sprite(this.textures[0]);
        this.renderSprite.anchor.set(0.5);
        this.renderSprite.width = size.x;
        this.renderSprite.height = size.y;
        this.renderSprite.x = this.screenPosition.x;
        this.renderSprite.y = this.screenPosition.y;
        this.moveDirection = new Vector2(0, 0);
        this.oldPosition = new Vector2(this.screenPosition.x, this.screenPosition.y);
        this.isMoving = false;
        this.moveSpeed = 6;
        this.moveProgress = 0;
        this.scaledMoveDirection = this.moveDirection; 
        this.shadowGraphics = new PIXI.Graphics();
        this.shadowGraphics.ellipse(0, 0, 20, 10);
        this.shadowGraphics.fill(0x000000, 0.35);
        this.shadowGraphics.x = this.screenPosition.x;
        this.shadowGraphics.y = this.screenPosition.y+28;
        this.unmodifiedScreenPos = new Vector2(this.screenPosition.x, this.screenPosition.y);
    }

    getScreenPosition (position) {
        return GridVectorToScreenVector(position, new Vector2(640, 640), new Vector2(8, 8));
    }

    getCoordinateScale () {
        return 80;
    }

    moveToDirection (direction) {
        if (this.isMoving) {
            return;
        }
        this.direction = direction;
        this.renderSprite.texture = this.textures[direction];
        this.isMoving = true;
        this.oldPosition = new Vector2(this.screenPosition.x, this.screenPosition.y);
        if (direction == 0) {
            this.gridPosition.y -= 1
            this.moveDirection = new Vector2(0, -1);
        }
        else if (direction == 1) {
            this.gridPosition.x += 1
            this.moveDirection = new Vector2(1, 0);
        }
        else if (direction == 2) {
            this.gridPosition.y += 1
            this.moveDirection = new Vector2(0, 1);
        }
        else if (direction == 3) {
            this.gridPosition.x -= 1
            this.moveDirection = new Vector2(-1, 0);
        }
    }

    getJumpHeigh(progress) {
        return -(Math.sin(Math.PI * progress)**0.75) * this.getCoordinateScale() * 0.3;
    }

    process (deltaTime) {
        if (this.isMoving) {
            if (this.moveProgress < 1 - (deltaTime * this.moveSpeed)) {
                this.moveProgress += (deltaTime * this.moveSpeed);
                this.scaledMoveDirection = this.moveDirection.MultipliedBy(this.getCoordinateScale());
                this.unmodifiedScreenPos.x = this.oldPosition.x + (this.scaledMoveDirection.x * this.moveProgress);
                this.unmodifiedScreenPos.y = this.oldPosition.y + (this.scaledMoveDirection.y * this.moveProgress);
                this.screenPosition.x = this.unmodifiedScreenPos.x;
                this.screenPosition.y = this.unmodifiedScreenPos.y + this.getJumpHeigh(this.moveProgress);
            }
            else {
                this.moveProgress = 0;
                this.isMoving = false;
                this.screenPosition = this.getScreenPosition(this.gridPosition);
                this.unmodifiedScreenPos = this.getScreenPosition(this.gridPosition);
            }
            this.renderSprite.x = this.screenPosition.x;
            this.renderSprite.y = this.screenPosition.y;
            this.shadowGraphics.x = this.screenPosition.x;
            this.shadowGraphics.y = this.unmodifiedScreenPos.y+28;
        }
    }
}