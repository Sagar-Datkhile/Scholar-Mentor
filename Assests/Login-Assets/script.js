const supabase = supabase.createClient(
  'https://naecognnktiibvkwfhks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZWNvZ25ua3RpaWJ2a3dmaGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTY0NzYsImV4cCI6MjA2MDI3MjQ3Nn0.r1IGt9Hx4-dr4lWpP0b9XX-pwoVRjzlMyys_IVZ8opY'
);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-target]").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));
            document.getElementById(link.getAttribute("data-target")).classList.add("active");
        });
    });

    document.getElementById("passout").addEventListener("change", function() {
        document.getElementById("passout-fields").classList.remove("hidden");
        document.getElementById("ongoing-fields").classList.add("hidden");
    });
    
    document.getElementById("ongoing").addEventListener("change", function() {
        document.getElementById("ongoing-fields").classList.remove("hidden");
        document.getElementById("passout-fields").classList.add("hidden");
    });
});

// Sign-Up with Database
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const username = signupForm.querySelector('input[placeholder="Username"]').value;
  const prn = signupForm.querySelector('input[placeholder="PRN No"]').value;
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const status = signupForm.querySelector('input[name="status"]:checked').value;
  const year = signupForm.querySelector('input[placeholder="Year of Passing"]').value;
  const department = signupForm.querySelectorAll('select#department')[0].value;

  // Step 1: Sign up using Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    alert("Sign up failed: " + signUpError.message);
    return;
  }

  // Step 2: Insert full profile in user_profiles
  const user_id = signUpData.user.id;

  const { error: insertError } = await supabase.from("user_profiles").insert([
    {
      id: user_id,           // Should match auth.users.id
      username: username,
      prn: prn,
      gender: gender,
      dob: dob,
      status: status,
      department: department,
      year_of_passing: year,
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
      alert('Login Error: ' + error.message);
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
  if (localStorage.getItem('admin_logged_in') !== 'true') {
    alert("Unauthorized access!");
    window.location.href = "/index.html";
  }

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
  