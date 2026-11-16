
// ==============================
// LOGIN FORM
// ==============================

const loginForm = document.getElementById("loginForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");

const submitButton = loginForm.querySelector(".auth-submit-btn");


// ==============================
// MESSAGE HANDLING
// ==============================

const message = document.createElement("p");

message.className = "form-message";
message.setAttribute("aria-live", "polite");

loginForm.insertBefore(message, submitButton);

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

addPasswordToggle(loginPassword);


// ==============================
// LOGIN FORM SUBMISSION
// ==============================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const identifier = loginEmail.value.trim();
    const passwordValue = loginPassword.value;

    // 1. Validate email or phone
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    if (
        !emailPattern.test(identifier) &&
        !phonePattern.test(identifier)
    ) {
        showMessage("Enter a valid email address or phone number.", "error");
        loginEmail.focus();
        return;
    }

    // 2. Validate password
    if (!passwordValue) {
        showMessage("Please enter your password.", "error");
        loginPassword.focus();
        return;
    }


    // ==============================
    // PREPARE LOGIN DATA
    // ==============================

    const loginData = {
        password: passwordValue
    };

    if (emailPattern.test(identifier)) {
        loginData.email = identifier;
    } else {
        loginData.phone = identifier;
    }


    // ==============================
    // BACKEND API INTEGRATION
    // ==============================

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Logging In...";

        showMessage("Verifying your credentials...", "success");

        const response = await fetch(
            "http://127.0.0.1:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify(loginData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        showMessage(data.message, "success");

        console.log("Login successful:", data);

        // Redirect after successful login
        setTimeout(() => {
            window.location.href = "customer-dashboard.html";
        }, 1500);

    } catch (error) {

        console.error("Login error:", error);

        showMessage(
            error.message || "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Login";

    }

});


// ==============================
// CLEAR MESSAGE ON INPUT
// ==============================

loginForm.addEventListener("input", function () {
    message.textContent = "";
    message.className = "form-message";
});
