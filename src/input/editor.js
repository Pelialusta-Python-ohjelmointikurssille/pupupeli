import { ace_version } from "../util/version_strings.js";
import { setCurrentLine } from "./py_error_handling.js";

let editor;
let currentLineMarker; //the line that is currently executing
let codeBlockListContainer = document.getElementById("code-blocks-container");
let codeBlocksListElement = document.getElementById("simpleList");
let aceEditorElement = document.getElementById("editor");
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
    currentLineMarker = editor.session.addMarker(new ace.Range(lineNumber - 1, 4, lineNumber - 1, 5), "executing-line", "fullLine");
}

export function resetLineHighlight() {
    setCurrentLine(null);
    editor.session.removeMarker(currentLineMarker);
}

/**
 * Sets if the aceEditor is visible inside the editor container.
 * Codeblocks are instead used as visuals, that arrange the code inside editor secretly.
 * @param {*} isCodeblockMode bool
 */
export function showCodeBlocksInsteadOfEditor(isCodeblockMode) {
    if (isCodeblockMode) {
        aceEditorElement.classList.add("is-hidden");
        codeBlockListContainer.classList.remove("is-hidden");
        return;
    }
    aceEditorElement.classList.remove("is-hidden");
    codeBlockListContainer.classList.add("is-hidden");
}

export function createCodeBlocks(strings) {
    while (codeBlocksListElement.firstChild) {
        codeBlocksListElement.removeChild(codeBlocksListElement.lastChild);
    }
    strings.forEach(codeblock => {
        createListGroupitem(codeblock);
    });
}

export function setEditorTextFromCodeBlocks() {
    let str = "";
    let children = codeBlocksListElement.children;
    for (var i = 0; i < children.length; i++) {
        str += children[i].textContent + "\n";
    }
    editor.setValue(str);
}

function createListGroupitem(string) {
    let listItem = document.createElement("div");
    listItem.className = "list-group-item";
    listItem.textContent = string;
    codeBlocksListElement.appendChild(listItem);
}
