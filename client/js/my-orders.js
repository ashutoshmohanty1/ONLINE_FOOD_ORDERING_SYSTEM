
// =====================================
// MY ORDERS
// =====================================

const API_URL = "http://127.0.0.1:3000/api/orders";


// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const ordersList = document.getElementById("ordersList");

const ordersLoading = document.getElementById("ordersLoading");

const emptyOrders = document.getElementById("emptyOrders");

const ordersError = document.getElementById("ordersError");

const ordersErrorText = document.getElementById("ordersErrorText");

const retryOrdersButton = document.getElementById("retryOrdersButton");

const orderStatusFilter = document.getElementById("orderStatusFilter");

const totalOrdersElement = document.getElementById("totalOrders");

const deliveredOrdersElement = document.getElementById("deliveredOrders");

const activeOrdersElement = document.getElementById("activeOrders");


// =====================================
// 2. STORE ORDERS
// =====================================

let orders = [];


// =====================================
// 3. FETCH CUSTOMER ORDERS
// =====================================

async function fetchMyOrders() {

    try {

        // Show loading
        ordersLoading.hidden = false;
        ordersError.hidden = true;
        emptyOrders.hidden = true;
        ordersList.innerHTML = "";

        const response = await fetch(`${API_URL}/my-orders`, {

            method: "GET",

            credentials: "include"

        });

        const data = await response.json();

        // Check authentication
        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }

        if (!response.ok) {

            throw new Error(data.message || "Unable to fetch orders");

        }

        // Store orders
        orders = data.orders || [];

        // Update statistics
        updateOrderStatistics();

        // Display orders
        displayOrders();

    } catch (error) {

        console.error("Fetch orders error:", error);

        ordersErrorText.textContent = error.message;

        ordersError.hidden = false;

    } finally {

        ordersLoading.hidden = true;

    }

}


// =====================================
// 4. UPDATE ORDER STATISTICS
// =====================================

function updateOrderStatistics() {

    const total = orders.length;

    const delivered = orders.filter(order =>
        order.orderStatus === "delivered"
    ).length;

    const active = orders.filter(order =>
        ["confirmed", "preparing", "out_for_delivery"]
            .includes(order.orderStatus)
    ).length;

    totalOrdersElement.textContent = total;

    deliveredOrdersElement.textContent = delivered;

    activeOrdersElement.textContent = active;

}


// =====================================
// 5. FORMAT DATE
// =====================================

function formatOrderDate(dateValue) {

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}


// =====================================
// 6. FORMAT STATUS
// =====================================

function formatOrderStatus(status) {

    const statusLabels = {

        confirmed: "Confirmed",

        preparing: "Preparing",

        out_for_delivery: "Out for Delivery",

        delivered: "Delivered",

        cancelled: "Cancelled"

    };

    return statusLabels[status] || status || "Unknown";

}


// =====================================
// 7. CREATE ORDER ITEM
// =====================================

function createOrderItem(item) {

    const itemElement = document.createElement("div");

    itemElement.className = "order-item";


    const image = document.createElement("img");

    image.className = "order-item-image";

    image.src = item.image || "";

    image.alt = item.name || "Food item";

    image.onerror = function () {
        this.style.display = "none";
    };


    const details = document.createElement("div");

    details.className = "order-item-details";


    const name = document.createElement("h4");

    name.textContent = item.name || "Food item";


    const quantity = document.createElement("p");

    quantity.textContent = `Quantity: ${item.quantity}`;


    details.append(name, quantity);


    const price = document.createElement("div");

    price.className = "order-item-price";

    price.textContent =
        `₹${(Number(item.price) * Number(item.quantity)).toFixed(2)}`;


    itemElement.append(image, details, price);

    return itemElement;

}


// =====================================
// 8. CREATE ORDER CARD
// =====================================

function createOrderCard(order) {

    const card = document.createElement("article");

    card.className = "order-card";


    // HEADER
    const header = document.createElement("div");

    header.className = "order-card-header";


    const orderInfo = document.createElement("div");


    const orderNumber = document.createElement("h3");

    orderNumber.className = "order-number";

    orderNumber.textContent = `Order #${order.orderNumber}`;


    const orderDate = document.createElement("p");

    orderDate.className = "order-date";

    orderDate.textContent = formatOrderDate(order.createdAt);


    orderInfo.append(orderNumber, orderDate);


    const status = document.createElement("span");

    status.className = `order-status status-${order.orderStatus}`;

    status.textContent = formatOrderStatus(order.orderStatus);


    header.append(orderInfo, status);


    // ORDER ITEMS
    const itemsContainer = document.createElement("div");

    itemsContainer.className = "order-items";


    (order.items || []).forEach(item => {

        itemsContainer.appendChild(createOrderItem(item));

    });


    // FOOTER
    const footer = document.createElement("div");

    footer.className = "order-card-footer";


    const payment = document.createElement("p");

    payment.className = "order-payment";

    payment.textContent =
        order.paymentMethod === "cod"
            ? "Payment: Cash on Delivery"
            : `Payment: ${order.paymentMethod || "Not available"}`;


    const total = document.createElement("p");

    total.className = "order-total";


    const totalLabel = document.createTextNode("Total: ");

    const totalAmount = document.createElement("span");

    totalAmount.textContent =
        `₹${Number(order.grandTotal || 0).toFixed(2)}`;


    total.append(totalLabel, totalAmount);

    footer.append(payment, total);


    // BUILD CARD
    card.append(header, itemsContainer, footer);

    return card;

}


// =====================================
// 9. DISPLAY ORDERS
// =====================================

function displayOrders() {

    ordersList.innerHTML = "";

    const selectedStatus = orderStatusFilter.value;

    let filteredOrders = orders;

    // Apply status filter
    if (selectedStatus !== "all") {

        filteredOrders = orders.filter(order =>
            order.orderStatus === selectedStatus
        );

    }


    // No orders
    if (filteredOrders.length === 0) {

        emptyOrders.hidden = false;

        const heading = emptyOrders.querySelector("h3");

        const message = emptyOrders.querySelector("p");

        if (orders.length === 0) {

            heading.textContent = "No Orders Found";

            message.textContent =
                "You haven't placed any orders yet. Start exploring delicious food!";

        } else {

            heading.textContent = "No Matching Orders";

            message.textContent =
                "There are no orders with this status.";

        }

        return;

    }


    emptyOrders.hidden = true;


    // Display every order
    filteredOrders.forEach(order => {

        const orderCard = createOrderCard(order);

        ordersList.appendChild(orderCard);

    });

}


// =====================================
// 10. FILTER ORDERS
// =====================================

orderStatusFilter.addEventListener("change", function () {

    displayOrders();

});


// =====================================
// 11. RETRY BUTTON
// =====================================

retryOrdersButton.addEventListener("click", function () {

    fetchMyOrders();

});


// =====================================
// 12. INITIALIZE PAGE
// =====================================

fetchMyOrders();
