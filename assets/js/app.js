import serviceLayer from "./serviceLayer.js";


// First, initialize the login state and check whether the user is logged in.
serviceLayer.initializeLoginState();
const isLoggedIn = serviceLayer.isLoggedIn();
// Grab wrapper elements
const landingPageWrapper = document.getElementById("landing-page-wrapper");
const appWrapper = document.getElementById("app-wrapper");

if (isLoggedIn) {
    landingPageWrapper.style.display = "none";
    console.log("User is logged in");
} else {
    
    const heroLoginButton = document.getElementById("hero-login");
    const footerLoginButton = document.getElementById("footer-login");
    heroLoginButton.addEventListener("click", serviceLayer.beginLoginFlow);
    footerLoginButton.addEventListener("click", serviceLayer.beginLoginFlow);
}









