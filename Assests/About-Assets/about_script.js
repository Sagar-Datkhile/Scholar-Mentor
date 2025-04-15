document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let formMessage = document.getElementById("formMessage");

    if (name === "" || email === "" || message === "") {
        alert("Please fill out all fields.");
        return;
    }

    // Simulate form submission success
    formMessage.classList.remove("hidden");
    setTimeout(() => {
        formMessage.classList.add("hidden");
        document.getElementById("contactForm").reset();
    }, 3000);
});
