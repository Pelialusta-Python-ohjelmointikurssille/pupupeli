import { Vector2 } from "../vector.js";
import { SCREEN } from "./graphics_constants.js";

/**
 * Entity used for changing viewport position and resolution scaling.
 * Acts as a virtual camera in the game world.
 */
export class GraphicsCamera {
    /**
     * 
     * @param {PIXI.Container} container Reference to PixiRenderer's cameraWorldContainer
     * @param {PIXI.Rectangle} pixiScreen Reference to PixiJS screen variable. Used to get game resolution
     * @param {Vector2} startPosition Start position of camera as a Vector2
     */
    constructor(container, pixiScreen, startPosition) {
        this.container = container;
        this.pixiScreen = pixiScreen;
        this.position = startPosition;
        // DEFAULT RES in graphics constants
        // 1024 is an arbitrary value, just used to get consistant scales
        // accross resolutions. Default resolution is 1024x1024
        this.renderScale = new Vector2(pixiScreen.width / SCREEN.DEFAULT_WIDTH, pixiScreen.height / SCREEN.DEFAULT_WIDTH);
        this.screenCenter = new Vector2(pixiScreen.width / 2, pixiScreen.height / 2)
        this.zoomScale = 1;
        this.rotation = 0;
        this.minZoom = 0.08;
        this.maxZoom = 0.95;
        this.focusPaddingPercent = 0.1;
        this.container.position.x = this.screenCenter.x;
        this.container.position.y = this.screenCenter.y;
        this.totalRenderScale = this.getTotalRenderScale();
        this.linearZoomValue = 100;

        this.viewportCorners = [
            this.screenToWorld(new Vector2(0, 0)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, 0)),
            this.screenToWorld(new Vector2(0, SCREEN.HEIGHT)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, SCREEN.HEIGHT))
        ];
        this.minX = null;
        this.minY = null;
        this.maxX = null;
        this.maxY = null;
        this.minXPos = null;
        this.minYPos = null;
        this.maxXPos = null;
        this.maxYPos = null;
        this.updatePosition();
    }

    /**
     * Update the camera's position and associated variables
     */
    updatePosition() {
        this.updateViewportCorners();
        this.clampPositionByViewPort();
        this.clampPositionToBounds();
        this.totalRenderScale = this.getTotalRenderScale();
        this.container.pivot.x = this.position.x;
        this.container.pivot.y = this.position.y;
        this.container.rotation = this.rotation;
        this.container.scale = this.totalRenderScale;  
        this.updateViewportCorners();
    }

    /**
     * 
     * @returns {number} Total render scale taking into account resolution and camera zoom.
     */
    getTotalRenderScale() {
        return this.renderScale.x * this.zoomScale;
    }
    
    /**
     * Called every frame.
     * @param {number} deltaTime Time delta in seconds 
     */
    onUpdate() {
        this.updatePosition();
    }

    /**
     * Move camera to a Vector2 point.
     * @param {Vector2} point 
     */
    moveToPoint(point) {
        this.position.x = point.x;
        this.position.y = point.y;
    }

    /**
     * Set camera to focus on an area, so that it fits inside camera view.
     * @param {Vector2} middle Middle position of the area.
     * @param {Vector2} size Width and height of the area.
     */
    focusOnAreaMiddle(middle, size) {
        let topLeft = new Vector2(middle.x - (size.x / 2), middle.y - (size.y / 2));
        let bottomRight = new Vector2(middle.x + (size.x / 2), middle.y + (size.y / 2));
        this.focusOnArea(topLeft, bottomRight);
    }

    /**
     * Set camera to focus on an area, so that it fits inside camera view.
     * @param {Vector2} topLeft Top left point of the area bounds.
     * @param {Vector2} bottomRight Bottom right point of the area bounds.
     */
    focusOnArea(topLeft, bottomRight) {
        let zoom = 1;
        let width = (bottomRight.x - topLeft.x);
        let height = (bottomRight.y - topLeft.y);
        let middle = new Vector2(topLeft.x + width / 2, topLeft.y + height / 2);
        this.moveToPoint(middle);

        if (width > height) zoom = SCREEN.WIDTH / width;
        else zoom = SCREEN.HEIGHT / height;
        this.setZoom(zoom * (1 - (this.focusPaddingPercent * zoom)));
        this.updatePosition();
        this.minX = this.viewportCorners[0].x;
        this.minY = this.viewportCorners[0].y;
        this.maxX = this.viewportCorners[3].x;
        this.maxY = this.viewportCorners[3].y;
    }

    setCameraArea(middle, size) {
        this.focusOnAreaMiddle(middle, size);
        this.setMinZoom(this.zoomScale);
        let topLeft = new Vector2(middle.x - (size.x / 2), middle.y - (size.y / 2));
        let bottomRight = new Vector2(middle.x + (size.x / 2), middle.y + (size.y / 2));
        this.minXPos = topLeft.x;
        this.minYPos = topLeft.y;
        this.maxXPos = bottomRight.x;
        this.maxYPos = bottomRight.y;
    }

    /**
     * Set camera zoom. Will be clamped if too big or small.
     * Smaller value means more zoomed out. Bigger means more zoomed in.
     * @param {number} value 
     */
    setZoom(value) {
        if (value > this.maxZoom) this.zoomScale = this.maxZoom;
        else if (value < this.minZoom) this.zoomScale = this.minZoom;
        else this.zoomScale = value;
        this.linearZoomValue = this.zoomScale * 100;
        this.updatePosition();
    }

    changeZoomLinear(valueDelta) {
        let delta = valueDelta / (1 - (this.linearZoomValue / 100))
        if (delta > 10) delta = 2;
        if (delta < -10) delta = -10;
        this.linearZoomValue += delta;
        if (this.linearZoomValue < 1) this.linearZoomValue = 1;
        if (this.linearZoomValue > 99) this.linearZoomValue = 95;
        this.setZoom(this.linearZoomValue / 100);
    }

    setMinZoom(value) {
        this.minZoom = value;
    }

    screenToWorld(screenVector) {
        return new Vector2(
            this.position.x + ((screenVector.x-(SCREEN.WIDTH / 2)) / this.totalRenderScale),
            this.position.y + ((screenVector.y-(SCREEN.HEIGHT / 2)) / this.totalRenderScale)
        );
    }

    clampPositionToBounds() {
        if (this.minXPos == null) return;
        if (this.minYPos == null) return;
        if (this.maxXPos == null) return;
        if (this.maxYPos == null) return;
        if (this.position.x < this.minXPos) this.position.x = this.minXPos;
        if (this.position.x > this.maxXPos) this.position.x = this.maxXPos;
        if (this.position.y < this.minYPos) this.position.y = this.minYPos;
        if (this.position.y > this.maxYPos) this.position.y = this.maxYPos;
    }

    clampPositionByViewPort() {
        if (this.minX == null) return;
        if (this.minY == null) return;
        if (this.maxX == null) return;
        if (this.maxY == null) return;
        if (this.viewportCorners[0].x < this.minX)
            this.position.x = this.minX + this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).x - this.viewportCorners[0].x;
        if (this.viewportCorners[0].y < this.minY)
            this.position.y = this.minY + this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).y - this.viewportCorners[0].y;
        if (this.viewportCorners[3].x > this.maxX)
            this.position.x = this.maxX - (this.viewportCorners[3].x - this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).x);
        if (this.viewportCorners[3].y > this.maxY)
            this.position.y = this.maxY - (this.viewportCorners[3].y - this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).y);
    }

    updateViewportCorners() {
        this.viewportCorners = [
            this.screenToWorld(new Vector2(0, 0)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, 0)),
            this.screenToWorld(new Vector2(0, SCREEN.HEIGHT)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, SCREEN.HEIGHT))
        ];
    }
}