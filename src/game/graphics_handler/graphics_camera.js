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

        this.viewportBounds = [null, null];
        this.positionBounds = [null, null];
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
        this.setViewportBounds(this.viewportCorners[0], this.viewportCorners[3]);
    }

    setCameraArea(middle, size) {
        this.focusOnAreaMiddle(middle, size);
        this.setMinZoom(this.zoomScale);
        let topLeft = new Vector2(middle.x - (size.x / 2), middle.y - (size.y / 2));
        let bottomRight = new Vector2(middle.x + (size.x / 2), middle.y + (size.y / 2));
        this.setPositionBounds(topLeft, bottomRight);
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

    /**
     * Sets minimum zoom value. Smaller value means objects look smaller in-game.
     * @param {number} value 
     */
    setMinZoom(value) {
        this.minZoom = value;
    }

    /**
     * Converts screen space coordinates to world space.
     * @param {Vector2} screenVector 
     * @returns Vector2 of coordinates in world space.
     */
    screenToWorld(screenVector) {
        return new Vector2(
            this.position.x + ((screenVector.x-(SCREEN.WIDTH / 2)) / this.totalRenderScale),
            this.position.y + ((screenVector.y-(SCREEN.HEIGHT / 2)) / this.totalRenderScale)
        );
    }

    /**
     * Clamps camera center position based on given bounds. 
     */
    clampPositionToBounds() {
        if (this.positionBounds == null) return;
        if (this.positionBounds[0] == null || this.positionBounds[1] == null) return;
        if (this.position.x < this.positionBounds[0].x) this.position.x = this.positionBounds[0].x;
        if (this.position.x > this.positionBounds[1].x) this.position.x = this.positionBounds[1].x;
        if (this.position.y < this.positionBounds[0].y) this.position.y = this.positionBounds[0].y;
        if (this.position.y > this.positionBounds[1].y) this.position.y = this.positionBounds[1].y;
    }

    /**
     * Clamps camera viewport corners based on given bounds. Tries to keep corners of camera inside the rectangle. 
     */
    clampPositionByViewPort() {
        if (this.viewportBounds == null) return;
        if (this.viewportBounds[0] == null || this.viewportBounds[1] == null) return;
        if (this.viewportCorners[0].x < this.viewportBounds[0].x) 
            this.position.x = this.viewportBounds[0].x + this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).x - this.viewportCorners[0].x;
        if (this.viewportCorners[0].y < this.viewportBounds[0].y)
            this.position.y = this.viewportBounds[0].y + this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).y - this.viewportCorners[0].y;
        if (this.viewportCorners[3].x > this.viewportBounds[1].x)
            this.position.x = this.viewportBounds[1].x - (this.viewportCorners[3].x - this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).x);
        if (this.viewportCorners[3].y > this.viewportBounds[1].y)
            this.position.y = this.viewportBounds[1].y - (this.viewportCorners[3].y - this.screenToWorld(new Vector2(SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2)).y);
    }

    /**
     * Updates values of the corners of the camera viewport.
     */
    updateViewportCorners() {
        this.viewportCorners = [
            this.screenToWorld(new Vector2(0, 0)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, 0)),
            this.screenToWorld(new Vector2(0, SCREEN.HEIGHT)),
            this.screenToWorld(new Vector2(SCREEN.WIDTH, SCREEN.HEIGHT))
        ];
    }
    /**
     * 
     * @param {Vector2} topLeft 
     * @param {Vector2} bottomRight 
     */
    setViewportBounds(topLeft, bottomRight) {
        this.viewportBounds = [topLeft, bottomRight];
    }

    /**
     * 
     * @param {Vector2} topLeft 
     * @param {Vector2} bottomRight 
     */
    setPositionBounds(topLeft, bottomRight) {
        this.positionBounds = [topLeft, bottomRight];
    }
}