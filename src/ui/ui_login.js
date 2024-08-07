import { login, logout } from "../api/api.js";
import { showPopUpNotification } from "../ui/ui.js";
import { createChapterButtons, createTaskButtons } from "./ui_buttons.js";
import { settingsTaskProgress } from "./ui_settings.js";

let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");

loginButton.addEventListener("click", () => {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    if (user === "" || pass === "") {
        showPopUpNotification("login-failed");
        return;
    }
    login(user, pass)
        .then(data => {
            if (data.token !== undefined) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", user);
            } else {
                showPopUpNotification("login-failed");
            }
            updateLoginUI();
            settingsTaskProgress();
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
            updateLoginUI();
            settingsTaskProgress();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

/**
 * Updates login UI depending on if the user is logged in or out.
 * Also calls ui_buttons to update task and chapter buttons.
 */
export function updateLoginUI() {
    if (localStorage.getItem("username") !== null) {
        document.getElementById("logged-in-as-user").innerText = localStorage.getItem("username");
    } else {
        document.getElementById("logged-in-as-user").innerText = "";
    }
    if (localStorage.getItem("token") !== null) {
        document.getElementById("logout-button").classList.remove("is-hidden");
        document.getElementById("logged-in-as-container").classList.remove("is-hidden");
        document.getElementById("user-container").classList.add("is-hidden");
    } else {
        document.getElementById("logout-button").classList.add("is-hidden");
        document.getElementById("logged-in-as-container").classList.add("is-hidden");
        document.getElementById("user-container").classList.remove("is-hidden");
    }
    createChapterButtons();
    createTaskButtons();
}