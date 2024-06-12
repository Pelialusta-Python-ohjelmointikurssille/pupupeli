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

export function createSpeechBubbleBunnySkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.ui.speech_bubble,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createCharacterRobotSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.characters.robot_down,
        upTexture: assets.characters.robot_up,
        downTexture: assets.characters.robot_down,
        leftTexture: assets.characters.robot_left,
        rightTexture: assets.characters.robot_right
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createCollectibleWrenchSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.collectibles.wrench,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createObstacleWellSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.obstacles.well,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createBackgroundMetalSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.backgrounds.metal,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}

export function createSpeechBubbleRobotSkin(skinName, theme, assets) {
    let skinOptions = {
        defaultTexture: assets.ui.speech_bubble,
    }
    return new EntitySkin(skinName, theme, skinOptions);
}