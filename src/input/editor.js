import { ace_version } from "../util/version_strings.js";

let editor;

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
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        editor.setOptions({
            fontSize: "12pt",
            showLineNumbers: true,
            showGutter: true,
            vScrollBarAlwaysVisible: true,
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });
    };
};

export function getEditor() {
    return editor;
}
