import { Vector2 } from "../vector.js";
import { GraphicsCameraEntity } from "./graphics_camera_entity.js";
import { GraphicsEntityFactory } from "./graphics_entity_factory.js";
import { AnimationFactory } from "./animations/animation_factory.js";



export class GraphicsEntitySystem {
    constructor(builtinAssets, renderer, graphicsHandler) {
        this.builtinAssets = builtinAssets;
        this.entityDict = new Map();
        this.spriteDict = new Map();
        this.gridObject = null;
        this.renderer = renderer;
        this.camera = null;
        this.entityFactory = new GraphicsEntityFactory(this, this.builtinAssets);
        this.isReady = true;
        this.graphicsHandler = graphicsHandler;
        this.animationFactory = new AnimationFactory();
    }

    updateAllObjects(deltaTime) {
        this.camera.onUpdate(deltaTime);
        let maybeReady = true;
        this.entityDict.forEach((value) => {
            value.onUpdate(deltaTime);
            if (value.isReady === false) {
                maybeReady = false;
            }
        });
        if (this.isReady === true && maybeReady === false) {
            this.onEntitiesNotReady();
        } 
        if (this.isReady === false && maybeReady === true) {
            this.onEntitiesReady();
        } 
        this.isReady = maybeReady;
    }

    createCamera(screen, container) {
        this.camera = new GraphicsCameraEntity(container, screen, new Vector2(30, 30));
    }

    createGraphicsEntity(entityId, type, data) {
        let entity = this.entityFactory.createEntity(entityId, type, data);
        if (type === "grid") {
            this.gridObject = entity;
            this.renderer.addToStage(entity.container);
            entity.onCreate();
            return;
        }
        this.entityDict.set(entityId, entity);
        this.renderer.addToStage(entity.container);
        entity.onCreate();
    }

    destroyGraphicsEntity(entityId) {
        this.renderer.removeFromStage(this.entityDict.get(entityId).container);
        this.entityDict.delete(entityId);
    }

    doAction(entityId, animationId, animationData) {
        let entity = this.getGraphicsEntity(entityId);
        let animation = this.animationFactory.getAnimation(animationId, entity, animationData);
        entity.doGridAnimation(animation);
    }

    getGraphicsEntity(entityId) {
        return this.entityDict.get(entityId);
    }

    getGridObject() {
        return this.gridObject;
    }

    onEntitiesNotReady() {
        this.graphicsHandler.onEntitiesNotReady();
    }

    onEntitiesReady() {
        this.graphicsHandler.onEntitiesReady();
    }

    resetGridObjects() {
        this.entityDict.forEach((value) => {
            if (value.type === "grid_object") {
                value.reset();
            }
        });
        console.log("Graphics were reset");
    }
}
