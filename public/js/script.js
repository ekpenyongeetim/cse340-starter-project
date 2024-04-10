const pswBtn = document.querySelector("#pswBtn");
pswBtn.addEventListener("click", function () {
  const pswdInput = document.getElementById("account_password");
  if (pswdInput.type === "password") {
    pswdInput.type = "text";
    pswBtn.textContent = "🔒";
  } else {
    pswdInput.type = "password";
    pswBtn.textContent = "👁️";
  }
});
