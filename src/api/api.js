import * as globals from "../util/globals.js";
import { getEditor } from "../input/editor.js";

let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");
let getTaskButton = document.getElementById("getTaskButton");
let getCompletedTasksButton = document.getElementById("getCompletedTasksButton");
const url = 'http://localhost:3000/api/';

loginButton.addEventListener("click", () => {
    login(url)
        .then(data => {
            localStorage.setItem("token", data.token);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

logoutButton.addEventListener("click", () => {
    logout(url)
        .then(data => {
            localStorage.removeItem("token");
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

getTaskButton.addEventListener("click", () => {
    getTask(url)
        .then(data => {
            console.log("get", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

getCompletedTasksButton.addEventListener("click", () => {
    getCompletedTasks(url)
        .then(data => {
            console.log("list", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function buildURL(baseURL, params) {
    const queryString = new URLSearchParams(params).toString();
    return `${baseURL}?${queryString}`;
}

async function sendPostRequest(url, data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

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
        console.log(json);
        return json;
    } catch (error) {
        // if parsing fails, return the raw response
        console.log(response);
        return response;
    }
}

async function sendGetRequest(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

export async function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const data = {
        username: user,
        password: pass
    };
    return sendPostRequest(url, data);
}

export async function logout() {
    const data = {
        token: localStorage.getItem("token")
    };
    return sendPostRequest(url, data);
}

export async function sendTask(taskIdentifier) {
    const token = localStorage.getItem("token");
    const task =  taskIdentifier;
    const editorData = getEditor().getValue();
    const result = globals.isGameWon;
    const data = {
        token: token,
        task: task,
        data: editorData,
        result: result
    }
    return sendPostRequest(url+"put", data);
}

export async function getTask() {
    const token = localStorage.getItem("token");
    const task = document.getElementById("task-get-input").value;
    const params = {
        token: token,
        task: task
    }
    const getURL = buildURL(url+"get", params);
    return sendGetRequest(getURL);
}

export async function getCompletedTasks() {
    const token = localStorage.getItem("token");
    const params = {
        token: token
    }
    const getURL = buildURL(url+"list", params);
    console.log(getURL);
    return sendGetRequest(getURL);
}

