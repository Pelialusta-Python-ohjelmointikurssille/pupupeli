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