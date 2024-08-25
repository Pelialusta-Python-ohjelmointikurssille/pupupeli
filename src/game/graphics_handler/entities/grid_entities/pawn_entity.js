import { Vector2 } from "../../../vector.js";
import { GraphicsEntity } from "../graphics_entity.js";

/**
 * Pawn entity used for graphical objects that conform to a grid. For example: player, obstacles,...
 */
export class PawnEntity extends GraphicsEntity {
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
        this.gridReference = entityHandler.getMainGridObject();
        this.gridPosition = new Vector2(0, 0);
        this.gridStartPosition = new Vector2(0, 0);
        this.fakeZPosition = 0;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridPosition);
        this.sizeWithinCellMultiplier = 0.9;
        this.sprite.anchor.set(0.5);
        this.lineDrawer = null; //given if needed at creation
    }

    addLineDrawer(lineDrawer) {
        this.lineDrawer = lineDrawer;
        this.entityHandler.renderer.addToStage(this.lineDrawer.graphics);
    }

    /**
     * Called when onCreate is called. Handles setting override variables if given using entityData.
     * Extended from base class.
     */
    applyEntityData() {
        super.applyEntityData();
        if (this.entityData.gridPosition != null) {
            this.gridPosition = this.entityData.gridPosition;
        }
    }

    /**
     * Called when the entity is created by the GraphicsEntityHandler.
     * Extended from base class.
     */
    onCreate() {
        super.onCreate();
        this.gridStartPosition = new Vector2(this.gridPosition.x, this.gridPosition.y);
        this.updatePosition();
        this.onFinishMove();
    }

    onDestroy() {
        if (this.lineDrawer !== null) {
            this.entityHandler.renderer.removeFromStage(this.lineDrawer.graphics);
            this.lineDrawer = null;
        }
        super.onDestroy();
    }

    /**
     * Skips/Fast forwards the currently playing animation to the end.
     * Extended from base class.
     */
    finishAnimationsInstantly() {
        super.finishAnimationsInstantly();
        // Fixes a bug where skipping animations would freeze the object mid animation.
        this.updatePosition();
    }

    /**
     * Reset the variables to initial values when created.
     * Extended from base class
     */
    reset() {
        super.reset();
        this.gridPosition = new Vector2(this.gridStartPosition.x, this.gridStartPosition.y);
        this.lineDrawer?.onPawnEntityReset();
        this.fakeZPosition = 0;
        this.updatePosition();
        this.onFinishMove();
    }

    /**
     * Updates the entity's position based on it's grid position. Also updates size based on grid size.
     */
    updatePosition() {
        this.sprite.height = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.sprite.width = this.sizeWithinCellMultiplier * this.gridReference.gridScale;
        this.screenPosition = this.gridReference.gridToScreenCoordinates(this.gridPosition);
        this.container.x = this.screenPosition.x;
        this.container.y = this.screenPosition.y + this.fakeZPosition;
    }

    onFinishMove() {
        this.updatePosition();
        if (this.lineDrawer !== null) this.lineDrawer.onUpdatePawnEntityPosition(this.screenPosition.x, this.screenPosition.y);
    }
}