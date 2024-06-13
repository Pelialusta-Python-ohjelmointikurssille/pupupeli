let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");
let sendTaskButton = document.getElementById("sendTaskButton");
let getTaskButton = document.getElementById("getTaskButton");
let getCompletedTasksButton = document.getElementById("getCompletedTasksButton");
const apiUrl = 'http://localhost:3000/api/';

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

sendTaskButton.addEventListener("click", () => {
    sendTask(apiUrl + "put")
        .then(data => {
            console.log("put", data);
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
        return json;
    } catch (error) {
        // if parsing fails, return the raw response
        return response;
    }
}

async function sendGetRequest(url, data) {
    return fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

async function login(url) {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const data = {
        username: user,
        password: pass
    };
    return sendPostRequest(url, data);
}

async function logout(url) {
    const data = {
        token: localStorage.getItem("token")
    };
    return sendPostRequest(url, data);
}

async function sendTask(url) {
    const token = localStorage.getItem("token");
    const task =  document.getElementById("task-send-input").value;
    const data = "fake_data";
    const result = 0;
    const dataobj = {
        token: token,
        task: task,
        data: data,
        result: result
    }
    return sendPostRequest(url, dataobj);
}

async function getTask(url) {
    const token = localStorage.getItem("token");
    const task = document.getElementById("task-get-input").value;
    const params = {
        token: token,
        task: task
    }
    const getUrl = buildUrl(url, params);
    return sendGetRequest(getUrl);
}

async function getCompletedTasks(url) {
    const token = localStorage.getItem("token");
    const params = {
        token: token
    }
    const getUrl = buildUrl(url, params);
    return sendGetRequest(getUrl);
}

