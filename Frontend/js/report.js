
let latitude = "";
let longitude = "";

const API = "https://civic-reporting-backend-vuir.onrender.com/api/issues";


// ===============================
// LOCATION
// ===============================
function getLocation() {

if (!navigator.geolocation) {
alert("Geolocation not supported");
return;
}

navigator.geolocation.getCurrentPosition(
(position) => {

latitude = position.coords.latitude;
longitude = position.coords.longitude;

document.getElementById("locationText")
.innerText = "Location Captured ✅";

},
() => alert("Location permission denied")
);
}


// ===============================
// SHOW ACTION FIELD
// ===============================
function checkReported(){

const reported =
document.getElementById("alreadyReported").value;

document.getElementById("actionSection").style.display =
reported === "yes" ? "block" : "none";

document.getElementById("reasonSection").style.display =
"none";
}


// ===============================
// SHOW REASON FIELD
// ===============================
function checkActionTaken(){

const action =
document.getElementById("actionTaken").value;

document.getElementById("reasonSection").style.display =
action === "yes" ? "block" : "none";
}


// ===============================
// SUBMIT ISSUE
// ===============================
function submitIssue(){

const token = localStorage.getItem("token");

if(!token){
alert("Please login first");
window.location="index.html";
return;
}

if(latitude==="" || longitude===""){
alert("Capture location first");
return;
}

const title =
document.getElementById("title").value;

const description =
document.getElementById("description").value;

const category =
document.getElementById("category").value;

const landmark =
document.getElementById("landmark").value;

const district =
document.getElementById("district").value;

const alreadyReported =
document.getElementById("alreadyReported").value;

const actionTaken =
document.getElementById("actionTaken")?.value || "no";

const unsolvedReason =
document.getElementById("unsolvedReason")?.value || "";

const image =
document.getElementById("image").files[0];

if(!title || !description || !image){
alert("Fill all fields");
return;

// ================= VALIDATION =================

// ALLOW ONLY CLEAN TEXT
const textPattern = /^[A-Za-z0-9\s.,-]+$/;

const landmark = document.getElementById("landmark").value.trim();
const district = document.getElementById("district").value.trim();
const alreadyReported = document.getElementById("alreadyReported").value;
const actionTaken = document.getElementById("actionTaken")?.value || "no";
const unsolvedReason = document.getElementById("unsolvedReason")?.value || "";

// TITLE
if(!title || !textPattern.test(title)){
alert("Enter valid title");
return;
}

// DESCRIPTION
if(!description || !textPattern.test(description)){
alert("Enter valid description");
return;
}

// CATEGORY
if(category === ""){
alert("Select category");
return;
}

// LANDMARK
if(!landmark || !textPattern.test(landmark)){
alert("Enter valid landmark");
return;
}

// DISTRICT
if(!district || !textPattern.test(district)){
alert("Enter valid district");
return;
}

// CONDITIONAL VALIDATION
if(alreadyReported === "yes"){
if(actionTaken === "yes" && !unsolvedReason){
alert("Enter reason why not solved");
return;
}
}
}


// FORM DATA
let formData = new FormData();

formData.append("title",title);
formData.append("description",description);
formData.append("category",category);
formData.append("latitude",latitude);
formData.append("longitude",longitude);
formData.append("landmark",landmark);
formData.append("district",district);
formData.append("alreadyReported",alreadyReported);
formData.append("actionTaken",actionTaken);
formData.append("unsolvedReason",unsolvedReason);
formData.append("image",image);


// API CALL
fetch(API+"/report",{
method:"POST",
headers:{
Authorization:"Bearer "+token
},
body:formData
})
.then(async(res)=>{

const data=await res.json();

if(!res.ok)
throw new Error(data.message);

return data;
})
.then(data=>{

alert("Issue Reported ✅");
window.location="dashboard.html";

})
.catch(err=>{
console.error(err);
alert(err.message);
});

}

