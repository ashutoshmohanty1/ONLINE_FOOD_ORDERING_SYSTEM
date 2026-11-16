
// ==============================
// REGISTRATION FORM
// ==============================

const registerForm = document.getElementById("registerForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const submitButton = registerForm.querySelector(".auth-submit-btn");


// ==============================
// MESSAGE HANDLING
// ==============================

const message = document.createElement("p");

message.className = "form-message";
message.setAttribute("aria-live", "polite");

registerForm.insertBefore(message, submitButton);

function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message ${type}`;
}


// ==============================
// PASSWORD SHOW / HIDE
// ==============================

function addPasswordToggle(input) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "password-toggle";
    button.innerHTML = '<i class="fa-regular fa-eye"></i>';
    button.setAttribute("aria-label", "Show password");

    input.parentElement.appendChild(button);

    button.addEventListener("click", () => {

        if (input.type === "password") {
            input.type = "text";
            button.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
            button.setAttribute("aria-label", "Hide password");
        } else {
            input.type = "password";
            button.innerHTML = '<i class="fa-regular fa-eye"></i>';
            button.setAttribute("aria-label", "Show password");
        }

    });

}

addPasswordToggle(password);
addPasswordToggle(confirmPassword);


// ==============================
// FORM SUBMISSION
// ==============================

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    // 1. Username validation
    if (usernameValue.length < 3) {
        showMessage("Username must contain at least 3 characters.", "error");
        username.focus();
        return;
    }

    // 2. Email validation
    if (!emailValue) {
        showMessage("Please enter your email address.", "error");
        email.focus();
        return;
    }

    // 3. Phone validation
    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phoneValue)) {
        showMessage("Enter a valid 10-digit Indian phone number.", "error");
        phone.focus();
        return;
    }

    // 4. Password validation
    if (passwordValue.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        password.focus();
        return;
    }

    // 5. Confirm password validation
    if (passwordValue !== confirmPasswordValue) {
        showMessage("Passwords do not match.", "error");
        confirmPassword.focus();
        return;
    }

    // 6. Terms validation
    if (!terms.checked) {
        showMessage("Please accept the Terms & Conditions.", "error");
        terms.focus();
        return;
    }

    // ==============================
    // BACKEND API INTEGRATION
    // ==============================

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";

        showMessage("Creating your account...", "success");

        const response = await fetch(
            "http://127.0.0.1:3000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    username: usernameValue,
                    email: emailValue,
                    phone: phoneValue,
                    password: passwordValue
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        showMessage(data.message, "success");

        console.log("Registration successful:", data);

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        console.error("Registration error:", error);

        showMessage(
            error.message || "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Create Account";

    }

});


// ==============================
// CLEAR MESSAGE ON INPUT
// ==============================

registerForm.addEventListener("input", function () {
    message.textContent = "";
    message.className = "form-message";
});
