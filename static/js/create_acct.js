function validatePasswords() {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const passwordError = document.getElementById("password-error");

  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordError.textContent = "Passwords do not match";
    return false;
  } else {
    passwordError.textContent = "";
    return true;
  }
}
