function login(event) {
  event.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // akun admin
  if(user === "muhammadrasidritonga" && pass === "22220155") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Username atau Password salah!");
  }
}
