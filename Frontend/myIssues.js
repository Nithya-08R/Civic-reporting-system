const API="http://localhost:5000/api/issues";

const token=localStorage.getItem("token");

if(!token){
alert("Login first");
window.location="login.html";
}


// LOAD ISSUES
fetch(API+"/my",{
method:"GET",
headers:{
"Authorization":"Bearer "+token
}
})
.then(res=>res.json())
.then(data=>{

console.log("Issues:",data);

const container=
document.getElementById("issuesContainer");

container.innerHTML="";

if(data.length===0){
container.innerHTML="<h3>No Issues Found</h3>";
return;
}

data.forEach(issue=>{

let color="red";

if(issue.status==="In Progress")
color="blue";

if(issue.status==="Resolved")
color="green";

container.innerHTML+=`
<div class="card">

<img src="http://localhost:5000/uploads/${issue.image_url}" />

<h3>${issue.title}</h3>

<p>${issue.description}</p>

<p><b>Department:</b> ${issue.department}</p>

<p><b>Status:</b>
<span style="color:${color}">
${issue.status}
</span>
</p>

</div>
`;

});

})
.catch(err=>{
console.log(err);
alert("Error loading issues");
});

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.href = "index.html";
}
