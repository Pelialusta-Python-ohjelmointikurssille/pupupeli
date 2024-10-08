import * as globals from "../util/globals.js";
import { getEditor } from "../input/editor.js";
import { translateToCommon } from "../util/theme_translator.js";
import { displayWarningMessage } from "../ui/ui.js";

const url = 'http://localhost:3000/api/';

/**
 * a function used to create api URLs from a base URL and an object
 * @param {string} baseURL a string containing the api URL and endpoint ("list/get/put" etc) 
 * @param {object} params an object containing the parameters to add to the GET request
 * @returns an URL string with the parameters added to the baseURL, for example https://example.com/api/get?token=...
 */
function buildURL(baseURL, params) {
    const queryString = new URLSearchParams(params).toString();
    return `${baseURL}?${queryString}`;
}

/**
 * a function used to send POST requests to the api
 * @param {string} url a string containing the api URL and endpoint, for example https://example.com/api/put
 * @param {*} params an object containing the parameters
 * @returns the response to the POST request, in JSON or if that fails, returns the raw response
 */
async function sendPostRequest(url, params) {
    const formData = new URLSearchParams();
    Object.keys(params).forEach(key => formData.append(key, params[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    try {
        // try to parse response body as JSON
        const json = await response.json();
        return json;
    } catch {
        // if parsing fails, return the raw response
        return response;
    }
}

/**
 * a function used to send GET requests to the api
 * @param {string} url a string containing the api URL and endpoint, for example https://example.com/api/list
 * @returns the response to the GET request, in JSON
 */
async function sendGetRequest(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

/**
 * a function used to login to the game
 * @returns a JSON object containing a token, for example: { token: "45h239809sdfy8s32g3h23u" }
 * the token is stored in localstorage and is required for all other api calls.
 */
export async function login(user, pass) {
    const params = {
        username: user,
        password: pass
    };
    return sendPostRequest(url + "login", params);
}

/**
 * a function used to log out of the game
 * @returns ?
 */
export async function logout() {
    const params = {
        token: localStorage.getItem("token")
    };
    return sendPostRequest(url + "logout", params);
}

/**
 * a function used to send a completed (failed or succeeded) task to the api
 * @param {string} taskIdentifier a unique task identifier, for example "chapter1task1"
 * @returns ?
 */
export async function sendTask() {
    const token = localStorage.getItem("token");
    const task = "chapter" + globals.identifiers.chapterIdentifier + "task" + globals.identifiers.taskIdentifier;
    let editorData = translateToCommon(getEditor().getValue());
    if (editorData.length > 10000) {
        displayWarningMessage("Koodisi on pidempi kuin 10000 merkkiä, joten se ei tallennu.");
        editorData = "";
    }
    const result = globals.isGameWon;
    const params = {
        token: token,
        task: task,
        data: editorData,
        result: result
    }
    return sendPostRequest(url + "put", params);
}

/**
 * a function used to get information about a specific task from the api
 * @returns a JSON object containing data about the task, usually the code from the editor used to complete the task,
 * as well as a result field, example: { data: ...code..., result: 1 }. result 1 implies a correct answer, while 0 is incorrect
 */
export async function getTask() {
    const token = localStorage.getItem("token");
    const task = "chapter" + globals.identifiers.chapterIdentifier + "task" + globals.identifiers.taskIdentifier;
    const params = {
        token: token,
        task: task
    }
    const getURL = buildURL(url + "get", params);
    return sendGetRequest(getURL);
}

/**
 * a function that that is used to get an array of successfully completed tasks
 * @returns a JSON object containing an array of successfully completed task identifiers, for example { tasks: ["chapter1task1","chapter1task2"] }
 */
export async function getCompletedTasks() {
    const token = localStorage.getItem("token");
    const params = {
        token: token
    }
    const getURL = buildURL(url + "list", params);
    return sendGetRequest(getURL);
}

