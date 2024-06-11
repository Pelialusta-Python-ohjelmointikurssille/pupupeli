import { EntitySkin } from "./entity_skin.js";

export function createCharacterBunnySkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.characters.bunny_down,
        upTexture: assets.characters.bunny_up,
        downTexture: assets.characters.bunny_down,
        leftTexture: assets.characters.bunny_left,
        rightTexture: assets.characters.bunny_right
    }
    return new EntitySkin(skinName, theme, skinOptions);
}