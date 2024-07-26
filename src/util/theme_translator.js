import * as globals from "../util/globals.js";

export function translateToCommon(editorCode) {
    const regex = new RegExp(`\\b(${globals.availableThemes.join('|')})\\.`, 'g');
    const translatedCode = editorCode.replace(regex, 'hahmo.');
    return translatedCode;
}

export function translateToTheme(editorCode) {
    const theme = globals.getCurrentTheme().toLowerCase();
    const regex = new RegExp('hahmo', 'g');
    const translatedCode = editorCode.replace(regex, theme);
    return translatedCode;
}