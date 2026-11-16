
// =====================================
// CUSTOMER DASHBOARD
// =====================================

const API_URL = "http://127.0.0.1:3000/api";


// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const headerUsername = document.getElementById("headerUsername");
const welcomeUsername = document.getElementById("welcomeUsername");

const totalOrdersElement = document.getElementById("totalOrders");
const completedOrdersElement = document.getElementById("completedOrders");
const pendingOrdersElement = document.getElementById("pendingOrders");

const recentOrdersBody = document.getElementById("recentOrdersBody");

const logoutButton = document.querySelector(".logout-link");

// Search elements
const dashboardSearchForm = document.getElementById("dashboardSearchForm");
const dashboardSearch = document.getElementById("dashboardSearch");

// Notification elements
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");
const notificationDot = document.getElementById("notificationDot");


// =====================================
// 2. FETCH LOGGED-IN USER PROFILE
// =====================================

async function getUserProfile() {

    try {

        const response = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch profile");
        }

        const username = data.user.username;

        if (headerUsername) {
            headerUsername.textContent = username;
        }

        if (welcomeUsername) {
            welcomeUsername.textContent = `Hello, ${username}! 👋`;
        }

        console.log("User profile:", data.user);

    } catch (error) {

        console.error("Profile error:", error);

        if (welcomeUsername) {
            welcomeUsername.textContent = "Unable to load your profile";
        }

    }

}


// =====================================
// 3. FETCH CUSTOMER ORDERS
// =====================================

async function getCustomerOrders() {

    try {

        const response = await fetch(`${API_URL}/orders/my-orders`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch orders");
        }

        const orders = data.orders || [];

        // Update dashboard statistics
        updateDashboardStatistics(orders);

        // Display latest 3 orders
        displayRecentOrders(orders);

        // Display latest order notifications
        displayNotifications(orders);

        console.log("Customer orders:", orders);

    } catch (error) {

        console.error("Orders error:", error);

        if (totalOrdersElement) {
            totalOrdersElement.textContent = "—";
        }

        if (completedOrdersElement) {
            completedOrdersElement.textContent = "—";
        }

        if (pendingOrdersElement) {
            pendingOrdersElement.textContent = "—";
        }

        if (recentOrdersBody) {
            recentOrdersBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Unable to load recent orders.
                        Please refresh the page.
                    </td>
                </tr>
            `;
        }

        if (notificationList) {
            notificationList.innerHTML = `
                <p class="notification-empty">
                    Unable to load notifications.
                </p>
            `;
        }

    }

}


// =====================================
// 4. UPDATE DASHBOARD STATISTICS
// =====================================

function updateDashboardStatistics(orders) {

    const totalOrders = orders.length;

    // Count delivered/completed orders
    const completedOrders = orders.filter(order =>
        ["delivered", "completed"].includes(order.orderStatus)
    ).length;

    // Count active orders
    const pendingOrders = orders.filter(order =>
        ["confirmed", "preparing", "out_for_delivery"]
            .includes(order.orderStatus)
    ).length;

    if (totalOrdersElement) {
        totalOrdersElement.textContent = totalOrders;
    }

    if (completedOrdersElement) {
        completedOrdersElement.textContent = completedOrders;
    }

    if (pendingOrdersElement) {
        pendingOrdersElement.textContent = pendingOrders;
    }

}


// =====================================
// 5. FORMAT ORDER DATE
// =====================================

function formatOrderDate(dateValue) {

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// =====================================
// 6. FORMAT ORDER STATUS
// =====================================

function formatOrderStatus(status) {

    const labels = {
        confirmed: "Confirmed",
        preparing: "Preparing",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Delivered",
        cancelled: "Cancelled"
    };

    return labels[status] || "Unknown";

}


// =====================================
// 7. DISPLAY RECENT ORDERS
// =====================================

function displayRecentOrders(orders) {

    if (!recentOrdersBody) return;

    recentOrdersBody.innerHTML = "";

    if (orders.length === 0) {

        recentOrdersBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:25px;">
                    You haven't placed any orders yet.

                    <a href="explore-food.html" style="color:#FF6B35;">
                        Explore Food
                    </a>
                </td>
            </tr>
        `;

        return;
    }

    // Sort newest orders first and display only 3
    const recentOrders = [...orders]
        .sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 3);


    recentOrders.forEach(order => {

        const row = document.createElement("tr");


        // ORDER NUMBER
        const orderIdCell = document.createElement("td");

        orderIdCell.textContent = `#${order.orderNumber}`;


        // FOOD ITEMS
        const foodCell = document.createElement("td");

        const foodContainer = document.createElement("div");

        foodContainer.className = "order-food";

        const foodImage = document.createElement("img");

        foodImage.src = order.items?.[0]?.image || "";

        foodImage.alt = order.items?.[0]?.name || "Food";

        foodImage.onerror = function () {
            this.style.display = "none";
        };

        const foodName = document.createElement("span");

        const firstFood = order.items?.[0]?.name || "Food item";

        const remainingItems = (order.items?.length || 0) - 1;

        foodName.textContent = remainingItems > 0
            ? `${firstFood} + ${remainingItems} more`
            : firstFood;

        foodContainer.append(foodImage, foodName);

        foodCell.appendChild(foodContainer);


        // DATE
        const dateCell = document.createElement("td");

        dateCell.textContent = formatOrderDate(order.createdAt);


        // AMOUNT
        const amountCell = document.createElement("td");

        amountCell.textContent =
            `₹${Number(order.grandTotal || 0).toFixed(2)}`;


        // STATUS
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        // Use delivered class for older completed status too
        const statusClass = order.orderStatus === "completed"
            ? "delivered"
            : order.orderStatus;

        statusBadge.className = `order-status ${statusClass}`;

        statusBadge.textContent =
            formatOrderStatus(order.orderStatus);

        statusCell.appendChild(statusBadge);


        // ACTION
        const actionCell = document.createElement("td");

        const viewButton = document.createElement("button");

        viewButton.className = "order-action";

        viewButton.textContent = "View";

        viewButton.addEventListener("click", () => {
            window.location.href = "my-orders.html";
        });

        actionCell.appendChild(viewButton);


        // ADD CELLS
        row.append(
            orderIdCell,
            foodCell,
            dateCell,
            amountCell,
            statusCell,
            actionCell
        );

        recentOrdersBody.appendChild(row);

    });

}


// =====================================
// 8. DASHBOARD SEARCH
// =====================================

if (dashboardSearchForm && dashboardSearch) {

    dashboardSearchForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const searchValue = dashboardSearch.value.trim();

        if (!searchValue) {
            dashboardSearch.focus();
            return;
        }

        window.location.href =
            `explore-food.html?search=${encodeURIComponent(searchValue)}`;

    });

}


// =====================================
// 9. NOTIFICATION PANEL
// =====================================

// Open and close notification panel

if (notificationBtn && notificationPanel) {

    notificationBtn.addEventListener("click", function(event) {

        event.stopPropagation();

        notificationPanel.hidden = !notificationPanel.hidden;

    });


    // Close panel when clicking outside

    document.addEventListener("click", function(event) {

        if (
            !notificationPanel.contains(event.target) &&
            !notificationBtn.contains(event.target)
        ) {
            notificationPanel.hidden = true;
        }

    });

}


// =====================================
// 10. DISPLAY NOTIFICATIONS
// =====================================

function displayNotifications(orders) {

    if (!notificationList) return;

    notificationList.innerHTML = "";

    if (!orders || orders.length === 0) {

        notificationList.innerHTML = `
            <p class="notification-empty">
                You don't have any order notifications.
            </p>
        `;

        if (notificationDot) {
            notificationDot.style.display = "none";
        }

        return;
    }


    // Show latest 5 orders
    const latestOrders = [...orders]
        .sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);


    if (notificationDot) {
        notificationDot.style.display = "block";
    }


    latestOrders.forEach(order => {

        const status = order.orderStatus;

        let message = "Your order status has been updated.";

        if (status === "confirmed") {

            message = "Your order has been confirmed.";

        } else if (status === "preparing") {

            message = "Your delicious food is being prepared.";

        } else if (status === "out_for_delivery") {

            message = "Your order is out for delivery.";

        } else if (
            status === "delivered" ||
            status === "completed"
        ) {

            message = "Your order has been successfully delivered!";

        } else if (status === "cancelled") {

            message = "Your order has been cancelled.";

        }


        const item = document.createElement("div");

        item.className = "notification-item";


        const heading = document.createElement("h4");

        heading.textContent = `Order #${order.orderNumber}`;


        const description = document.createElement("p");

        description.textContent = message;


        const date = document.createElement("small");

        date.textContent = formatOrderDate(order.createdAt);


        item.append(heading, description, date);

        notificationList.appendChild(item);

    });

}


// =====================================
// 11. LOGOUT
// =====================================

if (logoutButton) {

    logoutButton.addEventListener("click", async function(event) {

        event.preventDefault();

        try {

            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Logout failed");
            }

            alert("Logged out successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

            alert("Unable to logout. Please try again.");

        }

    });

}


// =====================================
// 12. INITIALIZE DASHBOARD
// =====================================

getUserProfile();

getCustomerOrders();
