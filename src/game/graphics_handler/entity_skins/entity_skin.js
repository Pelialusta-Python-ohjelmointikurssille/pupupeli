
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

export class EntitySkin {
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