import { subscribeToFinishCallbacks, subscribeToResetCallbacks, subscribeToSetLineCallbacks } from "../code_runner/code_runner.js";
import { ace_version } from "../util/version_strings.js";
import { setCurrentLine } from "./py_error_handling.js";

let editor;
let currentLineMarker; //the line that is currently executing
let errorLineMarker;

subscribeToSetLineCallbacks(highlightCurrentLine);
subscribeToResetCallbacks(resetLineHighlight);
subscribeToFinishCallbacks(resetLineHighlight);


let codeBlockListContainer = document.getElementById("code-blocks-container");
let codeBlocksListElement = document.getElementById("simpleList");
let currentlyHighlightedCodeBlock = undefined;
let currentlyErrorMarkedCodeBlock = undefined;
let aceEditorElement = document.getElementById("editor");
const codeBlockHolderClass = "list-group-itemholder";
const codeBlockHighlightClass = "list-group-itemholder-highlighted";
const codeBlockErrorLineClass = "list-group-itemholder-errorLine";
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
    if (!codeBlockListContainer.classList.contains("is-hidden")) {
        codeBlockHighlighLine(lineNumber);
        return;
    }
    if (currentLineMarker !== undefined) {
        editor.session.removeMarker(currentLineMarker);
    }
    // eslint-disable-next-line no-undef
    currentLineMarker = editor.session.addMarker(new ace.Range(lineNumber - 1, 4, lineNumber - 1, 5), "executing-line", "fullLine");
}

function codeBlockHighlighLine(lineNumber) {
    removeCodeBlockHighlight();
    let children = codeBlocksListElement.children;
    currentlyHighlightedCodeBlock = children[lineNumber - 1];
    currentlyHighlightedCodeBlock.classList.remove(codeBlockHolderClass);
    currentlyHighlightedCodeBlock.classList.add(codeBlockHighlightClass);
}

export function resetLineHighlight() {
    setCurrentLine(null);
    editor.session.removeMarker(currentLineMarker);
    editor.session.removeMarker(errorLineMarker);
    if (!codeBlockListContainer.classList.contains("is-hidden")) {
        removeCodeBlockHighlight();
        removeCodeBlockErrorLine();
    }
}

function removeCodeBlockHighlight() {
    if (currentlyHighlightedCodeBlock === undefined) return;
    currentlyHighlightedCodeBlock.classList.remove(codeBlockHighlightClass);
    currentlyHighlightedCodeBlock.classList.add(codeBlockHolderClass);
    currentlyHighlightedCodeBlock = undefined;
}

function removeCodeBlockErrorLine() {
    if (currentlyErrorMarkedCodeBlock === undefined) return;
    currentlyErrorMarkedCodeBlock.classList.remove(codeBlockErrorLineClass);
    currentlyErrorMarkedCodeBlock.classList.add(codeBlockHolderClass);
    currentlyErrorMarkedCodeBlock = undefined;
}


export function setErrorLine(lineNumber) {
    if (errorLineMarker !== undefined && errorLineMarker !== null) {
        editor.session.removeMarker(errorLineMarker);
    }
    if (!codeBlockListContainer.classList.contains("is-hidden")) {
        setCodeBlockErrorMark(lineNumber);
    }
    // eslint-disable-next-line no-undef
    errorLineMarker = editor.session.addMarker(new ace.Range(lineNumber - 1, 4, lineNumber - 1, 5), "error-line", "fullLine");
}

function setCodeBlockErrorMark(lineNumber) {
    removeCodeBlockHighlight();
    removeCodeBlockErrorLine();
    let children = codeBlocksListElement.children;
    currentlyErrorMarkedCodeBlock = children[lineNumber - 1];
    currentlyErrorMarkedCodeBlock.classList.remove(codeBlockHolderClass);
    currentlyErrorMarkedCodeBlock.classList.add(codeBlockErrorLineClass);
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

export function setEditorTextFromCodeBlocks() {
    let str = "";
    let children = codeBlocksListElement.children;
    //Children contain two divs, first is for the line number
    for (var i = 0; i < children.length; i++) {
        str += children[i].children[1].textContent + "\n";
    }
    editor.setValue(str);
}

export function createCodeBlocks(taskDataStrings, isEditorCodeSaved) {
    //clear from previous blocks
    while (codeBlocksListElement.firstChild) {
        codeBlocksListElement.removeChild(codeBlocksListElement.lastChild);
    }
    if (isEditorCodeSaved) {
        //if isEditorCodeSaved, then editor has the correct/last answer inserted.
        //But if task has been changed in any way, then the changes are ignored....
        //we avoid this issue by checking if anything has changed to the saved version.
        let lines = editor.session.getLines(0, taskDataStrings.length - 1);
        if (CheckIfStringsContainsSameStrings(taskDataStrings, lines) && CheckIfStringsContainsSameStrings(lines, taskDataStrings)) {
            createCodeBlockDivs(lines);
            return;
        }
    }
    //regular way (directly from task)
    createCodeBlockDivs(taskDataStrings);
}

/**
 * @param {*} strings1 
 * @param {*} strings2 
 * @returns returns true if strings2 contains all the strings strings1 contains.
 */
function CheckIfStringsContainsSameStrings(strings1, strings2) {
    if (strings1.length != strings2.length) return false;
    for (let i = 0; i < strings1.length; i++) {
        let matchFound = false;
        console.log("contains? : " + strings1[i]);
        for (let y = 0; y < strings1.length; y++) {
            if (strings1[i] == strings2[y]) {
                matchFound = true;
                break;
            }
        }
        if (!matchFound) return false;
    }
    return true;
}

function createCodeBlockDivs(strings) {
    for (let i = 0; i < strings.length; i++) {
        createListGroupitem(strings[i], i + 1);
    }
}

function createListGroupitem(string, index) {
    let div = document.createElement("div");
    div.className = codeBlockHolderClass;
    codeBlocksListElement.appendChild(div);
    let listItem = document.createElement("div");
    let listIndexItem = document.createElement("div");
    listItem.className = "list-group-item";
    listItem.textContent = string;
    listIndexItem.className = "list-group-index-item";
    listIndexItem.textContent = index;
    div.appendChild(listIndexItem);
    div.appendChild(listItem);
}
