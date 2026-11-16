
const API_URL = "http://127.0.0.1:3000/api";

// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const addressList = document.getElementById("addressList");
const addressForm = document.getElementById("addressForm");

const addAddressButton = document.getElementById("addAddressButton");
const cancelAddressButton = document.getElementById("cancelAddressButton");

const checkoutItems = document.getElementById("checkoutItems");

const subtotalElement = document.getElementById("checkoutSubtotal");
const deliveryFeeElement = document.getElementById("checkoutDeliveryFee");
const taxElement = document.getElementById("checkoutTax");
const grandTotalElement = document.getElementById("checkoutGrandTotal");

const placeOrderButton = document.getElementById("placeOrderButton");
const checkoutMessage = document.getElementById("checkoutMessage");


// =====================================
// 2. CART DATA
// =====================================

let cart = [];


// =====================================
// 3. FETCH USER CART
// =====================================

async function fetchCheckoutCart() {

    try {

        const response = await fetch(`${API_URL}/cart`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load cart");
        }

        cart = data.cart?.items || [];

        if (cart.length === 0) {
            alert("Your cart is empty!");
            window.location.href = "explore-food.html";
            return;
        }

        displayCheckoutItems();

    } catch (error) {

        console.error("Checkout cart error:", error);

        checkoutMessage.textContent = error.message;
        checkoutMessage.style.color = "#EF4444";

    }
}


// =====================================
// 4. DISPLAY CHECKOUT ITEMS
// =====================================

function displayCheckoutItems() {

    checkoutItems.innerHTML = "";

    cart.forEach(item => {

        const foodItem = document.createElement("div");

        foodItem.className = "checkout-food-item";

        foodItem.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="checkout-food-details">
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
            </div>

            <div class="checkout-food-price">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
        `;

        checkoutItems.appendChild(foodItem);

    });

    updateCheckoutTotal();
}


// =====================================
// 5. CALCULATE ORDER TOTAL
// =====================================

function updateCheckoutTotal() {

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const deliveryFee = 40;

    const tax = subtotal * 0.05;

    const grandTotal = subtotal + deliveryFee + tax;

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;

    deliveryFeeElement.textContent = `₹${deliveryFee.toFixed(2)}`;

    taxElement.textContent = `₹${tax.toFixed(2)}`;

    grandTotalElement.textContent = `₹${grandTotal.toFixed(2)}`;
}


// =====================================
// 6. ADDRESS FORM VISIBILITY
// =====================================


// =====================================
// ADDRESS MANAGEMENT
// =====================================

const ADDRESS_API = `${API_URL}/addresses`;

let addresses = [];
let selectedAddressId = null;


// =====================================
// 1. FETCH USER ADDRESSES
// =====================================

async function fetchAddresses() {

    try {

        const response = await fetch(ADDRESS_API, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch addresses");
        }

        addresses = data.addresses || [];

        selectedAddressId =
            addresses.find(address => address.isDefault)?._id ||
            addresses[0]?._id ||
            null;

        displayAddresses();

    } catch (error) {

        console.error("Fetch addresses error:", error);

        checkoutMessage.textContent = error.message;
        checkoutMessage.style.color = "#EF4444";

    }
}


// =====================================
// 2. DISPLAY SAVED ADDRESSES
// =====================================

function displayAddresses() {

    addressList.innerHTML = "";

    if (addresses.length === 0) {

        addressList.innerHTML = `
            <p class="no-address">
                You haven't saved any delivery address yet.
                Please add an address to continue.
            </p>
        `;

        return;
    }

    addresses.forEach(address => {

        const card = document.createElement("div");

        card.className = "saved-address";

        if (address._id === selectedAddressId) {
            card.classList.add("active");
        }

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "selectedAddress";
        radio.value = address._id;
        radio.checked = address._id === selectedAddressId;

        const details = document.createElement("div");
        details.className = "saved-address-details";

        const name = document.createElement("h3");
        name.textContent = address.fullName;

        const phone = document.createElement("p");
        phone.textContent = address.phone;

        const fullAddress = document.createElement("p");
        fullAddress.textContent =
            `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`;

        details.append(name, phone, fullAddress);

        const defaultLabel = document.createElement("span");
        defaultLabel.className = "default-address-label";
        defaultLabel.textContent = address.isDefault ? "Default" : "";

        card.append(radio, details, defaultLabel);

        radio.addEventListener("change", () => {
            selectedAddressId = address._id;
            displayAddresses();
        });

        addressList.appendChild(card);

    });
}


// =====================================
// 3. OPEN ADDRESS FORM
// =====================================

addAddressButton.addEventListener("click", function() {

    addressForm.hidden = false;
    addAddressButton.hidden = true;

});


// =====================================
// 4. CANCEL ADDRESS FORM
// =====================================

cancelAddressButton.addEventListener("click", function() {

    addressForm.reset();

    addressForm.hidden = true;
    addAddressButton.hidden = false;

});

// =====================================
// 5. SAVE NEW ADDRESS
// =====================================

addressForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const addressData = {

        fullName: document.getElementById("addressName").value.trim(),

        phone: document.getElementById("addressPhone").value.trim(),

        addressLine: document.getElementById("addressLine").value.trim(),

        city: document.getElementById("addressCity").value.trim(),

        state: document.getElementById("addressState").value.trim(),

        pincode: document.getElementById("addressPincode").value.trim()

    };

    try {

        const response = await fetch(`${ADDRESS_API}/add`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(addressData)

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save address");
        }

        alert("Address saved successfully!");

        addressForm.reset();

        addressForm.hidden = true;
        addAddressButton.hidden = false;

        await fetchAddresses();

    } catch (error) {

        console.error("Save address error:", error);

        alert(error.message);

    }

});


// =====================================
// 6. INITIALIZE ADDRESSES
// =====================================

fetchAddresses();



// =====================================
// 7. CASH ON DELIVERY
// =====================================

const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
);

console.log("Selected payment method:", paymentMethod?.value);


// =====================================
// 8. INITIALIZE CHECKOUT
// =====================================

fetchCheckoutCart();



// =====================================
// 9. PLACE ORDER
// =====================================

const orderSuccessOverlay = document.getElementById("orderSuccessOverlay");
const successOrderNumber = document.getElementById("successOrderNumber");

let isPlacingOrder = false;

placeOrderButton.addEventListener("click", async function () {

    // Prevent multiple clicks
    if (isPlacingOrder) return;

    // Check delivery address
    if (!selectedAddressId) {
        checkoutMessage.textContent = "Please select a delivery address.";
        checkoutMessage.style.color = "#EF4444";
        return;
    }

    // Check cart
    if (cart.length === 0) {
        checkoutMessage.textContent = "Your cart is empty.";
        checkoutMessage.style.color = "#EF4444";
        return;
    }

    try {

        isPlacingOrder = true;
        placeOrderButton.disabled = true;
        placeOrderButton.textContent = "Placing Order...";

        checkoutMessage.textContent = "";

        const response = await fetch(`${API_URL}/orders/place`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                addressId: selectedAddressId
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to place order.");
        }

        // Get successful order
        const order = data.order;

        // Save order ID for dashboard
        sessionStorage.setItem("newOrderId", order._id);

        // Display order confirmation
        successOrderNumber.textContent = `Order #${order.orderNumber}`;

        orderSuccessOverlay.hidden = false;

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = "customer-dashboard.html";
        }, 3500);

    } catch (error) {

        console.error("Place order error:", error);

        checkoutMessage.textContent = error.message;
        checkoutMessage.style.color = "#EF4444";

        isPlacingOrder = false;
        placeOrderButton.disabled = false;
        placeOrderButton.textContent = "Place Order";

    }

});

