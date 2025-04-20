function homePage() {
        // window.location.reload();
        window.open(window.location.href, '_self');


    }

    function aboutPage() {
        window.location.href= "about.html";
    }

    function goToHomeAndOpenLogin() {
    localStorage.setItem("openLoginPopup", "true");
    // Redirect to homepage
    window.location.href = "index.html";
    }
    document.getElementById("login").addEventListener("click", goToHomeAndOpenLogin);
    document.getElementById("home").addEventListener("click", homePage);
    document.getElementById("about").addEventListener("click", aboutPage);