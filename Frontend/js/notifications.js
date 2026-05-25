const API = "https://civic-reporting-backend-vuir.onrender.com/api/notifications";

async function loadNotifications(){

const token = localStorage.getItem("token");

const res = await fetch(API,{
headers:{
Authorization:"Bearer "+token
}
});

const data = await res.json();

const container =
document.getElementById("notificationList");

container.innerHTML = "";

data.forEach(n => {

container.innerHTML += `
<div class="card">
<p>${n.message}</p>
<small>${new Date(n.created_at).toLocaleString()}</small>
</div>
`;

});

}

loadNotifications();