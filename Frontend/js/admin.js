

// // ================= LOAD ON PAGE =================
// loadIssues();
const API = "https://civic-reporting-backend-vuir.onrender.com/api/issues";

let allIssues = []; // store all issues globally


// ================= LOAD ISSUES =================
async function loadIssues(){

const token = localStorage.getItem("token");

if(!token){
alert("Login required");
window.location = "index.html";
return;
}

try{

const res = await fetch(API + "/all", {
headers: {
Authorization: "Bearer " + token
}
});

// ❌ HANDLE SERVER ERROR
if(!res.ok){
const errData = await res.json();
alert(errData.message || "Server error");
return;
}

const data = await res.json();

console.log("ALL ISSUES:", data);

// ❌ HANDLE WRONG RESPONSE
if(!Array.isArray(data)){
alert("Invalid data from server");
return;
}

// ✅ STORE DATA
allIssues = data;

// ✅ UPDATE STATS
updateStats(data);

// ✅ DISPLAY TABLE
displayIssues(data);

}catch(err){
console.log("FETCH ERROR:", err);
alert("Something went wrong while loading issues");
}

}


// ================= UPDATE STATS =================
function updateStats(data){

let total = data.length;
let pending = 0;
let resolved = 0;
let progress = 0;

data.forEach(issue => {
if(issue.status === "Pending") pending++;
if(issue.status === "Resolved") resolved++;
if(issue.status === "In Progress") progress++;
});

// SAFE CHECK
if(document.getElementById("totalCount"))
document.getElementById("totalCount").innerText = total;

if(document.getElementById("pendingCount"))
document.getElementById("pendingCount").innerText = pending;

if(document.getElementById("resolvedCount"))
document.getElementById("resolvedCount").innerText = resolved;

}


// ================= DISPLAY ISSUES =================
function displayIssues(issues){

const table = document.getElementById("issueTable");

if(!table) return;

table.innerHTML = "";

// ❌ EMPTY STATE
if(issues.length === 0){
table.innerHTML = `
<tr>
<td colspan="6">No Issues Found</td>
</tr>
`;
return;
}

issues.forEach(issue => {

let statusClass = "";

if(issue.status === "Pending") statusClass = "status pending";
if(issue.status === "In Progress") statusClass = "status progress";
if(issue.status === "Resolved") statusClass = "status resolved";

table.innerHTML += `
<tr>

<td>
<img class="issue-img"
src="https://civic-reporting-backend.onrender.com/uploads/${issue.image_url || 'default.png'}">
</td>

<td>${issue.title || '-'}</td>
<td>${issue.category || '-'}</td>

<td>
<span class="dept-badge">
${issue.department || '-'}
</span>
</td>

<td>
<span class="${statusClass}">
${issue.status || '-'}
</span>
</td>

<td>
<select class="dropdown"
onchange="updateIssue(${issue.id}, '${issue.department}', this.value)">
<option ${issue.status==='Pending'?'selected':''}>Pending</option>
<option ${issue.status==='In Progress'?'selected':''}>In Progress</option>
<option ${issue.status==='Resolved'?'selected':''}>Resolved</option>
</select>
</td>

</tr>
`;

});

}


// ================= FILTER BY DEPARTMENT =================
function filterByDepartment(){

const dropdown = document.getElementById("deptFilter");

if(!dropdown) return;

const selected = dropdown.value;

if(selected === "All"){
displayIssues(allIssues);
}else{

const filtered =
allIssues.filter(issue =>
issue.department === selected
);

displayIssues(filtered);
}

}


// ================= UPDATE ISSUE =================
async function updateIssue(id, department, status){

const token = localStorage.getItem("token");

try{

const res = await fetch(API + "/update/" + id, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + token
},
body: JSON.stringify({
department,
status
})
});

const data = await res.json();

if(!res.ok){
alert(data.message || "Update failed");
return;
}

alert("Updated Successfully ✅");

// 🔄 reload
loadIssues();

}catch(err){
console.log("UPDATE ERROR:", err);
alert("Error updating issue");
}

}


// ================= LOAD PAGE =================
window.onload = loadIssues;

async function loadAdminFeedback(){

const token = localStorage.getItem("token");

const res = await fetch("https://civic-reporting-backend.onrender.com/api/feedback/all", {
headers: {
Authorization: "Bearer " + token
}
});

const data = await res.json();

const container = document.getElementById("adminFeedback");
container.innerHTML = "";

data.forEach(fb => {

container.innerHTML += `
<div class="card">
<h3>${fb.name}</h3>
<p><b>Phone:</b> ${fb.phone}</p>
<p><b>Type:</b> ${fb.feedback_type}</p>
<p>${fb.message}</p>
<p>⭐ ${fb.rating}/5</p>
</div>
`;

});

}

loadAdminFeedback();


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.href = "index.html";
}