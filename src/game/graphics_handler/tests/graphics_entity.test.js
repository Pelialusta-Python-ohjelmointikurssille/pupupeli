import { GraphicsEntity } from "../entities/graphics_entity.js";
import { EntitySkin } from "../entity_skins/entity_skin.js";

describe("Test GraphicsEntity", () => {
    let skin1;
    let skin2;
    let skin3;
    let skinBundle; 
    let gfxEntity;

    beforeEach(() => {
        skin1 = new EntitySkin("skin1_name", "theme1", { defaultTexture: null });
        skin2 = new EntitySkin("skin2_name", "theme2", { defaultTexture: null });
        skin3 = new EntitySkin("skin3_name", "theme3", { defaultTexture: null });
        skinBundle = new Map([["skin1_name", skin1], ["skin2_name", skin2], ["skin3_name", skin3]]);
        gfxEntity = new GraphicsEntity("UUID", null, { addChild: ()=>{} }, { texture: null }, null, skinBundle);
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
});
