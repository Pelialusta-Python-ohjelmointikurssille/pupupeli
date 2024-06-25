import * as PIXI from "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.5/pixi.mjs";
import { Vector2 } from "../vector.js";


export class GraphicalInputHandler {
    constructor(renderer, renderingCamera) {
        this.inputHitSprite = new PIXI.Sprite();
        this.inputHitSprite.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000);
        this.inputHitSprite.eventMode = "static";
        //this.inputHitSprite.cursor = "pointer";
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
        this.debug = new PIXI.Graphics();
        this.debug.zIndex = 100000000;
        this.screenCursorPos = new Vector2(0, 0);
        renderer.pixiApp.stage.addChild(this.debug);
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
        this.drawDebug();
        if (this.holdingMouse === false) return;
        this.lastMousePos.x = event.global.x;
        this.lastMousePos.y = event.global.y;
        this.renderingCamera.position.x += -(this.lastMousePos.x-this.mouseStartPos.x) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        this.renderingCamera.position.y += -(this.lastMousePos.y-this.mouseStartPos.y) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor);
        this.drawDebug();
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

    drawDebug() {
        this.debug.clear();
        this.debug
        .moveTo(this.mouseStartPos.x, this.mouseStartPos.y)
        .lineTo(this.mouseStartPos.x-(this.lastMousePos.x-this.mouseStartPos.x) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor), this.mouseStartPos.y-(this.lastMousePos.y-this.mouseStartPos.y) * this.dragSensitivity * (1 / this.renderingCamera.zoomScale * this.zoomDragFactor))
        .stroke({width: 2, color: 0xffff00});
        this.debug
        .rect(this.lastMousePos.x - 5, this.lastMousePos.y - 5, 10, 10)
        .fill({color: 0x00ffff});
        this.debug
        .rect(this.mouseStartPos.x - 5, this.mouseStartPos.y - 5, 10, 10)
        .fill({color: 0x0000ff});
        this.debug
        .rect(this.screenCursorPos.x - 4, this.screenCursorPos.y - 4, 8, 8)
        .fill({color: 0xff00ff});
        
    }
}