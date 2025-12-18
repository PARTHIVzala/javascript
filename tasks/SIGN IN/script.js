function signIn() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let errorMsg = document.getElementById("errorMsg");

  if (username === "" || password === "") {
    errorMsg.textContent = "Please fill all fields!";
    errorMsg.style.display = "block";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters!";
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";

  alert(`Welcome, ${username}! You have successfully signed in.`);
}
