import { login, logout, getStoredUsername } from "../api/api.js";
import { showPopUpNotification } from "../ui/ui.js";

let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");

loginButton.addEventListener("click", () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    login(user, pass)
        .then(data => {
            if (data.token !== undefined) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", getStoredUsername());
                window.location.reload();
            } else {
                showPopUpNotification("login-failed");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

logoutButton.addEventListener("click", () => {
    logout()
        .then(function() {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


export function updateLoginUI() {
    if (localStorage.getItem("username") !== null) {
        document.getElementById("logged-in-as-user").innerText = localStorage.getItem("username");
    }
    if (localStorage.getItem("token") !== null) {
        document.getElementById("logout-button").classList.remove("is-hidden");
        document.getElementById("logged-in-as-container").classList.remove("is-hidden");
    } else {
        document.getElementById("user-container").classList.remove("is-hidden");
    }
    console.log("updated login UI");
}