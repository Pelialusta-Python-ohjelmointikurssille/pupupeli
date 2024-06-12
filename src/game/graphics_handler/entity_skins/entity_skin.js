
/*
Skin options object structure:

{
    defaultTexture: PIXI Texture,
    upTexture: PIXI Texture,
    downTexture: PIXI Texture,
    leftTexture: PIXI Texture,
    rightTexture: PIXI Texture
}
*/

/**
 * This object should only be created by a factory function, which in turned should be defined in skins_manifest.js
 * 
 * Object that is used to represent an object's visual element. It enables an easier definition of visuals,
 * since it contains textures for direction and data about what theme should use this skin.
 */
export class EntitySkin {
    /**
     * 
     * @param {string} skinName Name of the skin. Used for reference.
     * @param {string} theme What theme the skin is a part of. An entity selects a skin using this id when setEntityThemes is called.
     * @param {*} skinOptions Object containing all the textures of the skin object.
     */
    constructor(skinName, theme, skinOptions) {
        this.skinName = skinName;
        this.theme = theme;
        this.defaultTexture = (skinOptions.defaultTexture != null) ? skinOptions.defaultTexture : null;
        this.upTexture = (skinOptions.upTexture != null) ? skinOptions.upTexture : null;
        this.downTexture = (skinOptions.downTexture != null) ? skinOptions.downTexture : null;
        this.leftTexture = (skinOptions.leftTexture != null) ? skinOptions.leftTexture : null;
        this.rightTexture = (skinOptions.rightTexture != null) ? skinOptions.rightTexture : null;
    }
}