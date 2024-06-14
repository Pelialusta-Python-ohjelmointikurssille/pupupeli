import { Direction } from "../../direction.js";
import { Vector2 } from "../../vector.js";
import { GraphicsEntity } from "../entities/graphics_entity.js";
import { EntitySkin } from "../entity_skins/entity_skin.js";

describe("Testing GraphicsEntity", () => {
    let dummyTexture1;
    let dummyTexture2;
    let dummyTexture3;
    let skin1;
    let skin2;
    let skin3;
    let dummyContainer;
    let skinBundle; 
    let gfxEntity;

    beforeEach(() => {
        dummyTexture1 = { height: 64, widht: 64 }
        dummyTexture2 = { height: 64, widht: 64 }
        dummyTexture3 = { height: 64, widht: 64 }
        skin1 = new EntitySkin("skin1_name", "theme1", { defaultTexture: dummyTexture1 });
        skin2 = new EntitySkin("skin2_name", "theme2", { defaultTexture: dummyTexture2 });
        skin3 = new EntitySkin("skin3_name", "theme3", { defaultTexture: dummyTexture3 });
        dummyContainer = { addChild: ()=>{}, position: { x: 0, y: 0 }, rotation: 0, scale: 1 , alpha: 1 };
        skinBundle = new Map([["skin1_name", skin1], ["skin2_name", skin2], ["skin3_name", skin3]]);
        gfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null, width: 64, height: 64 }, null, skinBundle);
    });

    test("If when initialized, first theme is current skin", () => {
        expect(gfxEntity.skins.get(gfxEntity.currentSkin).skinName).toBe("skin1_name");
    });

    test("If existing theme in skin bundle can be found correctly", () => {
        expect(gfxEntity.hasTheme("theme1")).toBe(true);
    });

    test("If non-existent theme in skin bundle is not found", () => {
        expect(gfxEntity.hasTheme("theme4")).toBe(false);
    });

    test("If themed skin that exists is set correctly when setting theme", () => {
        gfxEntity.setTheme("theme2");
        expect(gfxEntity.skins.get(gfxEntity.currentSkin).skinName).toBe("skin2_name");
    });

    test("If setting theme that doesn't exist then skin is not changed", () => {
        gfxEntity.setTheme("theme4");
        expect(gfxEntity.skins.get(gfxEntity.currentSkin).theme).not.toBe("theme4");
    });

    test("If resetting entity resets all container variables correctly", () => {
        let containerStartX = gfxEntity.container.position.x;
        let containerStartY = gfxEntity.container.position.y;
        let containerStartRotation = gfxEntity.container.rotation;
        let containerStartScale = gfxEntity.container.scale;
        let containerStartAlpha = gfxEntity.container.alpha;
        
        gfxEntity.container.position.x = 121;
        gfxEntity.container.position.y = 123;
        gfxEntity.container.scale = 0.5;
        gfxEntity.container.rotation = 30;
        gfxEntity.reset();

        expect(gfxEntity.container.position.x).toBe(containerStartX);
        expect(gfxEntity.container.position.y).toBe(containerStartY);
        expect(gfxEntity.container.rotation).toBe(containerStartRotation);
        expect(gfxEntity.container.scale).toBe(containerStartScale);
        expect(gfxEntity.container.alpha).toBe(containerStartAlpha);
    });

    test("If resetting entity resets all entity variables correctly", () => {
        let startIsReady = gfxEntity.isReady;
        let startDirection = gfxEntity.direction;
        
        gfxEntity.isReady = false;
        gfxEntity.direction = Direction.Right;
        gfxEntity.reset();

        expect(gfxEntity.isReady).toBe(startIsReady);
        expect(gfxEntity.direction).toBe(startDirection);
    });

    test("If given no entitydata, then values remain default", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = null;
        let newGfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null }, dummyEntityData, skinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
    });

    test("If given an entitydata position, then sets position correctly", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = { position: new Vector2(32, 32) };
        let newGfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null }, dummyEntityData, skinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(32);
        expect(newGfxEntity.container.position.y).toBe(32);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
    });

    test("If given an entitydata rotation, then sets rotation correctly", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = { rotation: 90 };
        let newGfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null }, dummyEntityData, skinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(90);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
    });

    test("If given an entitydata scale, then sets scale correctly", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = { scale: 2.3 };
        let newGfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null }, dummyEntityData, skinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(2.3);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
    });

    test("If given an entitydata direction, then sets direction correctly", () => {
        let dummyEntityData = { direction: Direction.Left };
        let newGfxEntity = new GraphicsEntity("UUID", null, dummyContainer, { texture: null }, dummyEntityData, skinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(Direction.Left);
    });
});
