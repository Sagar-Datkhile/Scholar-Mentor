document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-target]").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));
            document.getElementById(link.getAttribute("data-target")).classList.add("active");
        });
    });

    
});

const loginMsg = document.getElementById("login-message");

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
  const status = document.querySelector('#AluStu_tag').value;
  const yearRaw = signupForm.querySelector('input[placeholder="Year of Passing"]').value;
  const year = yearRaw === "" ? null : Number(yearRaw);
  const department = document.querySelector('#department').value;

  const signupMsg = document.getElementById("signUp-message");

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, 
        prn_no:prn,
        pass:password //  ==> Never Practice this, never store password on normal text format
      }
    }
  });

  if (signUpError) {
    signupMsg.style.color = 'red';
    signupMsg.innerText = "Sign up failed: " + signUpError.message;
      setTimeout(() => {
        signupMsg.innerText = "";
      }, 4000);

    return;
  }

  const user = signUpData.user;

  if (!user) {
    signupMsg.style.color = 'red';
      signupMsg.innerText = "Please check your email to confirm your account before proceeding.";
      setTimeout(() => {
        signupMsg.innerText = "";
      }, 4000);
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
      
      signupMsg.style.color = 'red';
      signupMsg.innerText = "Profile insertion failed: " + insertError.message;
      
      setTimeout(() => {
        signupMsg.innerText = "";
      }, 4000);
      return;
    }
  

    // If sign up successfully 
    signupMsg.style.color = 'green';
    signupMsg.innerText = "SignUp successful!";
      
      setTimeout(() => {
        alert("Check email for confirmation.");
        document.getElementById("signup-form").reset();
        window.location.href = "index.html";
      }, 1500);
    
    
  
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
          // alert('Login Error: ' + 'Email is not verified yet');
          loginMsg.style.color = 'red';
          loginMsg.innerText = "Login Error: Email is not verified yet";
          setTimeout(() => {
            loginMsg.innerText = "";
          }, 4000);
      }else{
      // alert('Login Error: ' + error.message);
      loginMsg.style.color = 'red';
      loginMsg.innerText = "Login Error: "+ error.message;
      setTimeout(() => {
        loginMsg.innerText = "";
      }, 4000);

      }
    } else {
      loginMsg.style.color = 'green';
      loginMsg.innerText = "Login successful!";
      
      setTimeout(() => {
        window.location.href= "Assests/Dashboard/Dashboard-user.html";    
        document.getElementById('login-form-user').reset();
      }, 1500);
      
    }
  }); 


//   Admin Login - Supabase 
    document.getElementById('login-form-admin').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('email', email)
      .eq('password', password) // use hashed password in production
      .single();

      const adminMsg = document.getElementById("admin-message");
    // if (error || !data) 
    if(data) {
      adminMsg.style.color = 'green';
      adminMsg.innerText = "Login successful!";

      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_username', data.username);
      
      
      setTimeout(() => {
        window.location.href = '/admin-dashboard.html';
        document.getElementById('login-form-admin').reset();
      }, 1500);
      
    }else{
      
      adminMsg.style.color = 'red';
      if(error.message){
        adminMsg.innerText = "Invalid Credential!";
      }
      
      setTimeout(() => {
        adminMsg.innerText = "";
      }, 4000);
    }
  });

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



//   Forgot Password with Supabase
//   document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
  
//     const emailv = document.getElementById("forgotemail").value;
//     const oTP = document.getElementById("otp").value;
//     const newPassword = document.getElementById("passWord").value;

//     const { data, error } = await supabase
//       .from('user_profiles')
//       .select('*')
//       .eq('email', email)
//       .single();
//       const forgetMsg = document.getElementById("forget-message");
//       if(!data){
//         forgetMsg.style.color = 'red';
//         forgetMsg.innerText = "Email not found in database!";
//         setTimeout(() => {
//           forgetMsg.innerText = "";
//         }, 4000);
//       }else {
            
//             // alert('Reset code sent! Check your inbox.');

//             const email = document.getElementById("forgotemail");
//             const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
//             const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
//             const { error: insertError } = await supabase.from("reset_otps").insert([
//               {
//                 email :email,
//                 otp : otp,
//                 expires_at:expiresAt
//               },
//             ]);
          

// // await sendEmail(email, `Your reset code is: ${otp}`);


//     // Email Service
//         (function(){
//           emailjs.init("PZTUbzJ-pRUw1UeTF"); 
//       })();

//       document.getElementById("btnForget").addEventListener("submit", function(event) {
//           event.preventDefault(); // Prevent form from reloading

          

//           const params = {
//               from_email: email,
//               from_passcode: otp,
//               from_time: expiresAt
//           };

//           emailjs.send("service_kyft5go", "template_tdkxbnc", params)
//               .then(response => {
//                   alert("OTP sent successfully!");
//               })
//               .catch(error => {
//                   alert("Error sending OTP: " + error.text);
                  
//               });
//       });

//     const { data, error } = await supabase
//   .from('reset_otps')
//   .select('*')
//   .eq('email', email)
//   .eq('otp',otp)
//   .single();

// if (!data || data.otp !== userOtp || new Date(data.expires_at) < new Date()) {
//   return { success: false, message: 'Invalid or expired OTP' };
// }

// // Update password
// const { error: updateError } = await supabase.auth.admin.updateUserByEmail(email, {
//   password: newPassword
// });

// // Optionally: delete OTP after use
// await supabase.from('reset_otps').delete().eq('email', email);

//     }
//   });
  