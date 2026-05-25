
// ================= API =================
const API = "https://civic-reporting-backend-vuir.onrender.com/api/auth";


// ================= REGISTER =================
function register(){

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

// VALIDATION
if(!name || !email || !password){
alert("Please fill all fields");
return;
}

fetch(API + "/register", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name,
email,
password
})
})
.then(async res => {

const data = await res.json();

if(!res.ok){
throw new Error(data.message || "Registration failed");
}

return data;

})
.then(data => {

alert(data.message || "Registered Successfully ✅");

// Redirect
window.location = "index.html";

})
.catch(err => {
console.log("REGISTER ERROR:", err);
alert(err.message);
});

}



// ================= LOGIN =================
function loginUser(){

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value.trim();

if(!email || !password){
alert("Enter Email & Password");
return;
}

fetch(API + "/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ email, password })
})
.then(async res => {

const data = await res.json();

if(!res.ok){
throw new Error(data.message || "Login failed");
}

return data;

})
.then(data => {

console.log("LOGIN RESPONSE:", data);

// TOKEN CHECK
if(data.token){

// SAVE
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

alert("Login Successful ✅");

// ROLE BASED REDIRECT
if(data.user && data.user.role && data.user.role.toLowerCase() === "admin"){
window.location = "admin.html";
}else{
window.location = "dashboard.html";
}

}else{
alert("Invalid login response");
}

})
.catch(err => {
console.log("LOGIN ERROR:", err);
alert(err.message);
});

}



// ================= LOGOUT =================
// 🔥 MAKE GLOBAL (IMPORTANT FIX)
window.logout = function(){

localStorage.removeItem("token");
localStorage.removeItem("user");

alert("Logged out successfully");

window.location = "index.html";

};