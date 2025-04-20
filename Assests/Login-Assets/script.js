document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[data-target]").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));
      document.getElementById(link.getAttribute("data-target")).classList.add("active");
    });
  });
});

// ===================== SIGN-UP =====================

const signupForm = document.getElementById("signup-form");
const signupMsg = document.getElementById("signUp-message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const username = signupForm.querySelector('input[placeholder="Username"]').value;
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
        prn_no: prn,
        pass: password
      }
    }
  });

  if (signUpError) {
    signupMsg.style.color = 'red';
    signupMsg.innerText = "Sign up failed: " + signUpError.message;
    setTimeout(() => signupMsg.innerText = "", 4000);
    return;
  }

  const user = signUpData.user;

  if (!user) {
    signupMsg.style.color = 'red';
    signupMsg.innerText = "Please check your email to confirm your account.";
    setTimeout(() => signupMsg.innerText = "", 4000);
    return;
  }

  const { error: insertError } = await supabase.from("user_profiles").insert([{
    id: user.id,
    username,
    email,
    prn_no: prn,
    gender,
    dob,
    status,
    passing_year: year,
    department
  }]);

  if (insertError) {
    signupMsg.style.color = 'red';
    signupMsg.innerText = "Profile insertion failed: " + insertError.message;
    setTimeout(() => signupMsg.innerText = "", 4000);
    return;
  }

  signupMsg.style.color = 'green';
  signupMsg.innerText = "SignUp successful!";
  setTimeout(() => {
    alert("Check email for confirmation.");
    signupForm.reset();
    window.location.href = "index.html";
  }, 1500);
});

// ===================== USER LOGIN =====================

const loginMsg = document.getElementById("login-message");

document.getElementById('login-form-user').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.querySelectorAll('input')[0].value;
  const password = e.target.querySelectorAll('input')[1].value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginMsg.style.color = 'red';
    loginMsg.innerText = "Login Error: " + (error.message === "Email not confirmed" ? "Email is not verified yet" : error.message);
    setTimeout(() => loginMsg.innerText = "", 4000);
  } else {
    loginMsg.style.color = 'green';
    loginMsg.innerText = "Login successful!";
    setTimeout(() => {
      window.location.href = "Assests/Dashboard/Dashboard-user.html";
      document.getElementById('login-form-user').reset();
    }, 1500);
  }
});

// ===================== ADMIN LOGIN =====================

document.getElementById('login-form-admin').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  const adminMsg = document.getElementById("admin-message");

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (data) {
    adminMsg.style.color = 'green';
    adminMsg.innerText = "Login successful!";
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_username', data.username);

    setTimeout(() => {
      window.location.href = '/admin-dashboard.html';
      document.getElementById('login-form-admin').reset();
    }, 1500);
  } else {
    adminMsg.style.color = 'red';
    adminMsg.innerText = "Invalid Credentials!";
    setTimeout(() => adminMsg.innerText = "", 4000);
  }
});

function logoutAdmin() {
  localStorage.removeItem('admin_logged_in');
  localStorage.removeItem('admin_username');
  window.location.href = "/index.html";
}

// ===================== FORGOT PASSWORD (OTP FLOW) =====================

const otpInput = document.getElementById("otp");
const passwordInput = document.getElementById("passWord");
const forgetMsg = document.getElementById("forget-message");
const btnForget = document.getElementById("btnForget");

let step = "send_otp";
let otpOriginal = "";
let expiresAt = null;

otpInput.style.display = "none";
passwordInput.style.display = "none";

btnForget.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotemail").value;
  const userOtp = otpInput.value;
  const newPassword = passwordInput.value;

  if (step === "send_otp") {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (!data) {
      forgetMsg.style.color = 'red';
      forgetMsg.innerText = "Email not found!";
      setTimeout(() => forgetMsg.innerText = "", 4000);
      return;
    }

    otpOriginal = Math.floor(100000 + Math.random() * 900000).toString();
    expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await supabase.from("reset_otps").insert([{ email, otp: otpOriginal, expires_at: expiresAt }]);

    emailjs.init("PZTUbzJ-pRUw1UeTF");
    const params = {
      email,
      passcode: otpOriginal,
      time: expiresAt.toLocaleString()
    };

    emailjs.send("service_kyft5go", "template_tdkxbnc", params)
      .then(() => alert("OTP sent successfully!"))
      .catch(error => alert("Error sending OTP: " + error.text));

    otpInput.style.display = "block";
    btnForget.innerText = "Verify OTP";
    step = "verify_otp";
    return;
  }

  if (step === "verify_otp") {
    if (userOtp !== otpOriginal || new Date() > expiresAt) {
      forgetMsg.style.color = 'red';
      forgetMsg.innerText = "Invalid or Expired OTP!";
      setTimeout(() => forgetMsg.innerText = "", 4000);
      return;
    }

    passwordInput.style.display = "block";
    btnForget.innerText = "Reset Password";
    step = "reset_password";
    return;
  }

  if (step === "reset_password") {
    const updateUserPassword = async (email, newPassword) => {
      const { data: user, error: fetchError } = await supabase.auth.admin.getUserByEmail(email);
    
      if (fetchError || !user) {
        console.error('User not found:', fetchError?.message || 'No user');
        return;
      }
    
      const { error: updateError } = await supabase.auth.admin.updateUser(user.id, {
        password: newPassword,
        user_metadata: {
          updated_at: new Date().toISOString(),
          user_pass: newPassword,
        }
      });
    
      if (updateError) {
        console.error('Password update failed:', updateError.message);
      } else {
        console.log('Password updated successfully!');
      }
    };
  }
});
