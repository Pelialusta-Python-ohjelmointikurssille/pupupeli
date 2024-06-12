// testi, ei tarkoitus käyttää

let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");
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

async function login(url = '') {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const data = {
        username: user,
        password: pass
    }
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    return response.json();
}

async function logout(url = '') {
    const data = {
        token: localStorage.getItem("token")
    }
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    return response;
}

/*async function postData(data, url) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    return response.json();
}*/