import { Direction } from "../../direction.js";
import { Vector2 } from "../../vector.js";
import { GraphicsEntity } from "../entities/graphics_entity.js";
import { EntitySkin } from "../entity_skins/entity_skin.js";

describe("Testing GraphicsEntity", () => {
    let mockTexture1;
    let mockTexture2;
    let mockTexture3;
    let mockSprite;
    let mockSkin1;
    let mockSkin2;
    let mockSkin3;
    let mockDummyContainer;
    let mockSkinBundle; 
    let gfxEntity;
    let mockAnimation;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTexture1 = { height: 64, widht: 64 }
        mockTexture2 = { height: 64, widht: 64 }
        mockTexture3 = { height: 64, widht: 64 }
        mockSprite = { texture: null, width: 64, height: 64 };
        mockSkin1 = new EntitySkin("skin1_name", "theme1", { defaultTexture: mockTexture1 });
        mockSkin2 = new EntitySkin("skin2_name", "theme2", { defaultTexture: mockTexture2 });
        mockSkin3 = new EntitySkin("skin3_name", "theme3", { defaultTexture: mockTexture3 });
        mockDummyContainer = { addChild: jest.fn(), position: { x: 0, y: 0 }, rotation: 0, scale: 1 , alpha: 1 };
        mockSkinBundle = new Map([["skin1_name", mockSkin1], ["skin2_name", mockSkin2], ["skin3_name", mockSkin3]]);
        mockAnimation = { start: jest.fn(), stop: jest.fn(), increment: jest.fn(), skipToEnd: jest.fn() };
        gfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, mockSprite, null, mockSkinBundle);
    });

    test("If when initialized and if sprite is not null, sprite added as child of container", () => {
        expect(mockDummyContainer.addChild).toHaveBeenCalledWith(mockSprite);
    });

    test("If when initialized and if sprite is null, sprite is not added as child of container", () => {
        let newMockDummyContainer = { addChild: jest.fn(), position: { x: 0, y: 0 }, rotation: 0, scale: 1 , alpha: 1 };
        let newGfxEntity = new GraphicsEntity("UUID", null, newMockDummyContainer, null, null, mockSkinBundle);
        expect(newMockDummyContainer.addChild).not.toHaveBeenCalled();
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
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null }, dummyEntityData, mockSkinBundle);
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
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null }, dummyEntityData, mockSkinBundle);
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
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null }, dummyEntityData, mockSkinBundle);
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
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null }, dummyEntityData, mockSkinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(2.3);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
    });

    test("If given an entitydata direction, then sets direction correctly", () => {
        let dummyEntityData = { direction: Direction.Left };
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null }, dummyEntityData, mockSkinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(Direction.Left);
    });

    test("If given a size for sprite, then sets sprite size correctly", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = { size: new Vector2(32, 32) };
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, { texture: null, width: 64, height: 64 }, dummyEntityData, mockSkinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
        expect(newGfxEntity.sprite.width).toBe(32);
        expect(newGfxEntity.sprite.height).toBe(32);
    });

    test("If given a size for sprite and sprite is null, do nothing", () => {
        let defaultStartDirection = Direction.Down;
        let dummyEntityData = { size: new Vector2(32, 32) };
        let newGfxEntity = new GraphicsEntity("UUID", null, mockDummyContainer, null, dummyEntityData, mockSkinBundle);
        newGfxEntity.onCreate();
        expect(newGfxEntity.container.position.x).toBe(0);
        expect(newGfxEntity.container.position.y).toBe(0);
        expect(newGfxEntity.container.scale).toBe(1);
        expect(newGfxEntity.container.rotation).toBe(0);
        expect(newGfxEntity.direction).toBe(defaultStartDirection);
        expect(newGfxEntity.sprite).toBe(null);
    });
});
