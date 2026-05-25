
const API = "https://civic-reporting-backend-vuir.onrender.com/api/feedback";

function submitFeedback(){

const token = localStorage.getItem("token");

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const type = document.getElementById("type").value;
const rating = document.getElementById("rating").value;
const message = document.getElementById("message").value.trim();

// VALIDATION
const namePattern = /^[A-Za-z\s]+$/;
const phonePattern = /^[0-9]{10}$/;

if(!name || !namePattern.test(name)){
alert("Enter valid name");
return;
}

if(!phone || !phonePattern.test(phone)){
alert("Enter valid 10-digit phone");
return;
}

if(!type){
alert("Select feedback type");
return;
}

if(!rating){
alert("Select rating");
return;
}

if(!message){
alert("Enter message");
return;
}

// API CALL
fetch(API + "/add", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + token
},
body: JSON.stringify({
name,
phone,
feedback_type: type,
rating,
message
})
})
.then(res => res.json())
.then(data => {

alert(data.message || "Feedback Submitted");

window.location = "dashboard.html";

})
.catch(err => {
console.log(err);
alert("Error submitting feedback");
});

}