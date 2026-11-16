
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const createdAt = document.getElementById("createdAt");

async function getUserProfile() {
    try {
        const response = await fetch(
            "http://127.0.0.1:3000/api/auth/profile",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Unable to load profile");
        }

        const user = data.user;

        profileUsername.textContent = user.username;
        profileEmail.textContent = user.email;

        username.textContent = user.username;
        email.textContent = user.email;
        phone.textContent = user.phone;

        createdAt.textContent = new Date(user.createdAt)
            .toLocaleDateString("en-IN");

    } catch (error) {
        console.error("Profile error:", error);
        profileUsername.textContent = "Unable to load profile";
    }
}

getUserProfile();
