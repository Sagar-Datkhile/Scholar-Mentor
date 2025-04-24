  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  if (userId) {
    console.log("Logged in as:", username, "with ID:", userId);
    // Proceed to fetch user data, etc.
  } else {
    console.log("User not logged in");
  //   window.location.href= "index.html";
  window.location.replace("https://sagar-datkhile.github.io/Scholar-Mentor/index.html");
    
  }

  // LOG OUT ==================================================================================
  async function logOut(){
      let confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    
        // Redirect to login page
        window.location.replace("https://sagar-datkhile.github.io/Scholar-Mentor/index.html");
      }
  }
      

    
  function homePage() {
          // window.location.reload();
          window.open(window.location.href, '_self');


      }

   