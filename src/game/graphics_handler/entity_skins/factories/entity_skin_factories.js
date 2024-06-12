import { EntitySkin } from "../entity_skin.js";

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

export function createCollectibleCarrotSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.collectibles.carrot,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createObstacleRockSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.obstacles.rock,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createBackgroundGrassSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.backgrounds.grass,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createSpeechBubbleSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.ui.speech_bubble,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}