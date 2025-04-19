//  JavaScript 

 new Typed(".introLine2", {
    strings: ["Career Growth", "Networking Opportunities", "Student-Alumni Engagement"],
    typeSpeed: 30,
    backSpeed: 30,
    loop: true,
});



    // JavaScript to control popup
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    
    function showPopup() {
      popup.style.display = "flex";
      overlay.style.display = "block";
    }

    function hidePopup() {
      popup.style.display = "none";
      overlay.style.display = "none";
    }


    // Optional: Close popup when pressing ESC key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            hidePopup();
        }
    });

    const loginMsg = document.getElementById("login-message");
    document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-target]").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("data-target");

      // Clear all forms before switching
      
      document.querySelectorAll("form").forEach(form => form.reset());
      

    
      // Hide all form containers
      document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));

      // Show the selected form container
      document.getElementById(targetId).classList.add("active");
    });
  });
});



// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll("a[data-target]").forEach(link => {
//     link.addEventListener("click", (event) => {
//       event.preventDefault();
//       const targetId = link.getAttribute("data-target");

//       // Hide all form containers
//       document.querySelectorAll(".form-container").forEach(form => {
//         form.classList.remove("active");
//       });

//       // Clear all forms to remove leftover input
//       document.querySelectorAll("form").forEach(form => {
//         form.reset();
//       });
//       loginMsg.textContent = "";

//       // Show the target form container
//       const targetContainer = document.getElementById(targetId);
//       if (targetContainer) {
//         targetContainer.classList.add("active");
//       }
//     });
//   });
// });

    

 

    // Navigation Bar
    function homePage() {
        window.location.href = "index.html"; 
    }

    function aboutPage() {
        window.location.href= "Assests/About-Assets/about.html";
    }

    document.getElementById("home").addEventListener("click", homePage);
    document.getElementById("about").addEventListener("click", aboutPage);

    document.addEventListener("DOMContentLoaded", () => {
    // Check for the flag
    if (localStorage.getItem("openLoginPopup") === "true") {
        localStorage.removeItem("openLoginPopup"); // Remove so it doesn't happen again
        // Trigger the Get Started button
        document.querySelector("#getStarted").click();
    }

   
});




