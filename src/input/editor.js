import { subscribeToResetCallbacks, subscribeToSetLineCallbacks } from "../code_runner/code_runner.js";
import { ace_version } from "../util/version_strings.js";
import { setCurrentLine } from "./py_error_handling.js";

let editor;
let currentLineMarker; //the line that is currently executing
let errorLineMarker;

subscribeToSetLineCallbacks(highlightCurrentLine);
subscribeToResetCallbacks(resetLineHighlight);

const aceEditorScript = document.createElement('script');
aceEditorScript.src = `https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/ace.js`;
document.head.appendChild(aceEditorScript);

aceEditorScript.onload = () => {
    const languageToolsScript = document.createElement('script');
    languageToolsScript.src = `https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/ext-language_tools.js`;
    document.head.appendChild(languageToolsScript);

    const pythonModeScript = document.createElement('script');
    pythonModeScript.src = `https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/mode-python.js`;
    document.head.appendChild(pythonModeScript);

    const pythonSnippetsScript = document.createElement('script');
    pythonSnippetsScript.src = `https://cdnjs.cloudflare.com/ajax/libs/ace/${ace_version}/snippets/python.js`;
    document.head.appendChild(pythonSnippetsScript);

    languageToolsScript.onload = () => {
        // eslint-disable-next-line no-undef
        editor = ace.edit("editor");
        editor.session.setMode("ace/mode/python");
        editor.setTheme("ace/theme/dawn");

        // eslint-disable-next-line no-undef
        ace.require("ace/ext/language_tools");

        editor.setOptions({
            fontSize: "12pt",
            showLineNumbers: true,
            showGutter: true,
            vScrollBarAlwaysVisible: true,
            enableBasicAutocompletion: false,
            enableSnippets: false,
            enableLiveAutocompletion: false,
        });
    };
};

/**
 * Returns ace editor object
 * @returns {object} editor
 */
export function getEditor() {
    return editor;
}

export function highlightCurrentLine(lineNumber) {
    setCurrentLine(lineNumber);
    if (currentLineMarker !== undefined) {
        editor.session.removeMarker(currentLineMarker);
    }
    // eslint-disable-next-line no-undef
    currentLineMarker = editor.session.addMarker(new ace.Range(lineNumber-1, 4, lineNumber-1, 5), "executing-line", "fullLine");
}

export function resetLineHighlight() {
    setCurrentLine(null);
    editor.session.removeMarker(currentLineMarker);
    editor.session.removeMarker(errorLineMarker);
}

export function setErrorLine(lineNumber) {
    if (errorLineMarker !== undefined && errorLineMarker !== null) {
        editor.session.removeMarker(errorLineMarker);
    }
    // eslint-disable-next-line no-undef
    errorLineMarker = editor.session.addMarker(new ace.Range(lineNumber-1, 4, lineNumber-1, 5), "error-line", "fullLine");
}