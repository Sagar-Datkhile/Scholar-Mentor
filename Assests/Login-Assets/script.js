// const supabase = window.supabase.createClient(
//   'https://naecognnktiibvkwfhks.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZWNvZ25ua3RpaWJ2a3dmaGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTY0NzYsImV4cCI6MjA2MDI3MjQ3Nn0.r1IGt9Hx4-dr4lWpP0b9XX-pwoVRjzlMyys_IVZ8opY'
// );

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-target]").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));
            document.getElementById(link.getAttribute("data-target")).classList.add("active");
        });
    });

    
});

// Sign-Up with Database
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const username = signupForm.querySelector('input[placeholder="Username"]').value;
  username.replace(/\s+/g, '');
  username.toLowerCase();

  const prn = signupForm.querySelector('input[placeholder="PRN No"]').value;
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;

  const status = document.querySelector('#AluStu_tag').value;
  
  const yearRaw = signupForm.querySelector('input[placeholder="Year of Passing"]').value;
  const year = yearRaw === "" ? null : Number(yearRaw);
  const department = document.querySelector('#department').value;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, 
        prn_no:prn,
        // pass:password  ==> Never Practice this, never store password on normal text format
      }
    }
  });

  if (signUpError) {
    alert("Sign up failed: " + signUpError.message);
    return;
  }

  const user = signUpData.user;

  if (!user) {
    alert("Please check your email to confirm your account before proceeding.");
    return;
  }

    const { error: insertError } = await supabase.from("user_profiles").insert([
      {
        id: user.id,
        username: username,
        email:email,
        prn_no: prn,
        gender: gender,
        dob: dob,
        status: status,
        passing_year:year,
        department: department
      },
    ]);
  
    if (insertError) {
      alert("Profile insertion failed: " + insertError.message);
      return;
    }
  
    alert("Sign up successful!");
    window.location.href = "Assests/About-Assets/about.html";
    
  
});
  
// User-Login with Supabase
document.getElementById('login-form-user').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = e.target.querySelectorAll('input')[0].value;
    const password = e.target.querySelectorAll('input')[1].value;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      if(error.message == "Email not confirmed"){
          alert('Login Error: ' + 'Email is not verified yet');
      }else{
      alert('Login Error: ' + error.message);
      }
    } else {
      alert('Login successful!');
      // You can redirect or show user dashboard here
    }
  }); 

//   Admin Login - Supabase 


  async function loginAdmin(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('username', username)
      .eq('password', password) // use hashed password in production
      .single();

    if (error || !data) {
      alert("Invalid admin credentials.");
    } else {
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_username', data.username);
      alert("Welcome Admin!");
      window.location.href = '/admin-dashboard.html';
    }
  }

  //Protect Admin Dashboard
  // if (localStorage.getItem('admin_logged_in') !== 'true') {
  //   alert("Unauthorized access!");
  //   window.location.href = "/index.html";
  // }

//   Logout Button for Admin
function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    window.location.href = "/index.html";
  }

  // Attach to admin form
  document.getElementById('login-form-admin').addEventListener('submit', loginAdmin);
  







//   Forgot Password with Supabase
document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = e.target.querySelector('input').value;
  
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Reset email sent! Check your inbox.');
    }
  });
  