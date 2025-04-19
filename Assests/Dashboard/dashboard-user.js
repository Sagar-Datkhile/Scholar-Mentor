



const connectButtons = document.querySelectorAll(".connect-btn");
  const chatContainer = document.getElementById("chatContainer");
  const alumniSection = document.getElementById("alumniSection");
  const chatName = document.getElementById("chatName");
  const chatRole = document.getElementById("chatRole");
  const chatAvatar = document.getElementById("chatAvatar");
  const chatExperience = document.getElementById("chatExperience");
  const chatEducation = document.getElementById("chatEducation");

  connectButtons.forEach(btn => {
  btn.onclick = () => {
    const c = btn.closest(".card");
    chatName.textContent = c.dataset.name;
    chatRole.textContent = c.dataset.role;
    chatAvatar.src = c.dataset.img;
    chatEducation.textContent = c.dataset.edu;
    chatExperience.innerHTML = JSON.parse(c.dataset.exp)
      .map(item => `<li>${item}</li>`).join("");

    alumniSection.style.display = "none";
    chatContainer.style.display = "flex";
  };
});


  function closeChat() {
    chatContainer.style.display = "none";
    document.getElementById("chatInput").style.display = "none";
    document.getElementById("chatMessages").style.display = "none";
    alumniSection.style.display = "block";
  }

  function startChat() {
    document.getElementById("chatInput").style.display = "flex";
    document.getElementById("chatMessages").style.display = "block";
  }
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