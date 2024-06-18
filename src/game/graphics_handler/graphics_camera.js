import { Vector2 } from "../vector.js";

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
        // 1024 is an arbitrary value, just used to get consistant scales
        // accross resolutions. Default resolution is 1024x1024
        this.renderScale = new Vector2(pixiScreen.width / 1024, pixiScreen.height / 1024);
        this.screenCenter = new Vector2(pixiScreen.width / 2, pixiScreen.height / 2)
        this.zoomScale = 1;
        this.rotation = 0;
        this.minZoom = 0.5;
        this.maxZoom = 1.5;
        this.container.position.x = this.screenCenter.x;
        this.container.position.y = this.screenCenter.y;
        this.totalRenderScale = this.getTotalRenderScale();
        this.updatePosition();
    }

    /**
     * Update the camera's position and associated variables
     */
    updatePosition() {
        this.totalRenderScale = this.getTotalRenderScale();
        //this.container.position.x = -this.position.x;
        //this.container.position.y = -this.position.y;
        this.container.pivot.x = this.position.x;
        this.container.pivot.y = this.position.y;
        this.container.rotation = this.rotation;
        this.container.scale = this.totalRenderScale;
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
    // deltaTime is used to sychronize the camera with the game loop
    // eslint-disable-next-line no-unused-vars
    onUpdate(deltaTime) {
        this.updatePosition();
    }

    moveToPoint(point) {
        this.position.x = point.x;
        this.position.y = point.y;
    }

    setZoom(value) {
        if (value > this.maxZoom) this.zoomScale = this.maxZoom;
        else if (value < this.minZoom) this.zoomScale = this.minZoom;
        else this.zoomScale = value;
    }
}