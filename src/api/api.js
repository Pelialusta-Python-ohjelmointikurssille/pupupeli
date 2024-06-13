import * as globals from "../util/globals.js";
import { getEditor } from "../input/editor.js";

let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");
let getTaskButton = document.getElementById("getTaskButton");
let getCompletedTasksButton = document.getElementById("getCompletedTasksButton");
export const apiUrl = 'http://localhost:3000/api/';

loginButton.addEventListener("click", () => {
    login(apiUrl + "login")
        .then(data => {
            localStorage.setItem("token", data.token);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

logoutButton.addEventListener("click", () => {
    logout(apiUrl + "logout")
        .then(data => {
            localStorage.removeItem("token");
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

getTaskButton.addEventListener("click", () => {
    getTask(apiUrl + "get")
        .then(data => {
            console.log("get", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

getCompletedTasksButton.addEventListener("click", () => {
    getCompletedTasks(apiUrl + "list")
        .then(data => {
            console.log("list", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function buildUrl(url, params) {
    const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}`;
}

export async function sendPostRequest(url, data) {
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

export async function sendGetRequest(url, data) {
    return fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

export async function login(url) {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const data = {
        username: user,
        password: pass
    };
    return sendPostRequest(url, data);
}

export async function logout(url) {
    const data = {
        token: localStorage.getItem("token")
    };
    return sendPostRequest(url, data);
}

export async function sendTask(url, taskIdentifier) {
    console.log(url, taskIdentifier);
    const token = localStorage.getItem("token");
    const task =  taskIdentifier;
    const data = getEditor().getValue();
    const result = globals.isGameWon;
    const dataobj = {
        token: token,
        task: task,
        data: data,
        result: result
    }
    return sendPostRequest(url+"put", dataobj);
}

export async function getTask(url) {
    const token = localStorage.getItem("token");
    const task = document.getElementById("task-get-input").value;
    const params = {
        token: token,
        task: task
    }
    const getUrl = buildUrl(url, params);
    return sendGetRequest(getUrl);
}

export async function getCompletedTasks(url) {
    const token = localStorage.getItem("token");
    const params = {
        token: token
    }
    const getUrl = buildUrl(url, params);
    return sendGetRequest(getUrl);
}

