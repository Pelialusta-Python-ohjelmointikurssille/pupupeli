import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { Vector2 } from "../vector.js";


export class GraphicalInputHandler {
    constructor(renderer, renderingCamera) {
        this.inputHitSprite = new PIXI.Sprite();
        this.inputHitSprite.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000);
        this.inputHitSprite.eventMode = "static";
        this.inputHitSprite.on("wheel", this.onWheel, this);
        this.inputHitSprite.on("mousemove", this.onMouseMove, this);
        this.inputHitSprite.on("mouseup", this.onMouseUp, this);
        this.inputHitSprite.on("mousedown", this.onMouseDown, this);
        this.inputHitSprite.on("mouseenter", this.onMouseEnter, this);
        this.inputHitSprite.on("mouseleave", this.onMouseLeave, this);
        this.inputHitSprite.zIndex = 10000000;
        this.renderingCamera = renderingCamera;
        renderer.pixiApp.stage.addChild(this.inputHitSprite);
        this.mouseStartPos = new Vector2(0, 0);
        this.holdingMouse = false;
        this.lastMousePos = new Vector2(0, 0);
        this.dragSensitivity = 2;
        this.zoomDragFactor = 0.5;
        this.screenCursorPos = new Vector2(0, 0);
    }

    onWheel(event) {
        // Fixes weird camera bug that makes everything disappear
        if (event.deltaY === 0) return;
        let deltaNormalized = event.deltaY / Math.abs(event.deltaY);
        this.renderingCamera.changeZoomLinear((-deltaNormalized * 2));
        if (this.renderingCamera.zoomScale <= this.renderingCamera.minZoom || this.renderingCamera.zoomScale >= this.renderingCamera.maxZoom) return;
        this.renderingCamera.position.x += (event.global.x - 512) / 4 * -deltaNormalized * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        this.renderingCamera.position.y += (event.global.y - 512) / 4 * -deltaNormalized * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        
    }

    onMouseMove(event) {
        this.screenCursorPos.x = event.global.x;
        this.screenCursorPos.y = event.global.y;
        if (this.holdingMouse === false) return;
        this.lastMousePos.x = event.global.x;
        this.lastMousePos.y = event.global.y;
        this.renderingCamera.position.x += -(this.lastMousePos.x-this.mouseStartPos.x) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        this.renderingCamera.position.y += -(this.lastMousePos.y-this.mouseStartPos.y) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        this.mouseStartPos.x = event.global.x;
        this.mouseStartPos.y = event.global.y;
    }

    onMouseDown(event) {
        this.holdingMouse = true;
        this.mouseStartPos.x = event.global.x;
        this.mouseStartPos.y = event.global.y;
    }

    onMouseUp() {
        this.holdingMouse = false;
    }

    onMouseEnter() {
        this.holdingMouse = false;
    }

    onMouseLeave() {
        this.holdingMouse = false;
    }
}