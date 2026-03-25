const togglePassword = document.getElementById("togglePassword")
const passwordInput = document.getElementById("account_password")

togglePassword.addEventListener("click", () => {
  const currentType = passwordInput.getAttribute("type")

  if (currentType === "password") {
    passwordInput.setAttribute("type", "text")
    togglePassword.textContent = "Hide"
  } else {
    passwordInput.setAttribute("type", "password")
    togglePassword.textContent = "Show"
  }
})