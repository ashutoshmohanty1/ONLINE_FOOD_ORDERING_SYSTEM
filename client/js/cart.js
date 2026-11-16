
const API_URL = "http://127.0.0.1:3000/api/cart";

// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const cartItemsContainer = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");

const cartItemCount = document.getElementById("cartItemCount");
const subtotalElement = document.getElementById("subtotal");
const deliveryFeeElement = document.getElementById("deliveryFee");
const taxElement = document.getElementById("tax");
const grandTotalElement = document.getElementById("grandTotal");

const checkoutButton = document.getElementById("checkoutButton");


// =====================================
// 2. GET CART DATA FROM MONGODB
// =====================================

let cart = [];

async function fetchCart() {

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch cart");
        }

        cart = data.cart?.items || [];

        displayCart();

    } catch (error) {

        console.error("Fetch cart error:", error);

        alert("Unable to load cart. Please login again.");

        window.location.href = "login.html";
    }
}


// =====================================
// 3. DISPLAY CART ITEMS
// =====================================

function displayCart() {

    cartItemsContainer.innerHTML = "";

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartItemCount.textContent =
        `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`;

    if (cart.length === 0) {

        emptyCart.hidden = false;
        cartItemsContainer.hidden = true;

        checkoutButton.disabled = true;

        updateOrderSummary();

        return;
    }

    emptyCart.hidden = true;
    cartItemsContainer.hidden = false;

    checkoutButton.disabled = false;

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
                class="cart-item-image"
            >

            <div class="cart-item-details">

                <h3>${item.name}</h3>

                <p>₹${item.price} each</p>

                <div class="cart-item-price">
                    Subtotal: ₹${(item.price * item.quantity).toFixed(2)}
                </div>

            </div>

            <div class="quantity-control">

                <button
                    class="decrease-quantity"
                    data-id="${item.foodId}"
                    aria-label="Decrease quantity"
                >
                    <i class="fa-solid fa-minus"></i>
                </button>

                <span>${item.quantity}</span>

                <button
                    class="increase-quantity"
                    data-id="${item.foodId}"
                    aria-label="Increase quantity"
                >
                    <i class="fa-solid fa-plus"></i>
                </button>

            </div>

            <button
                class="remove-cart-item"
                data-id="${item.foodId}"
                aria-label="Remove item"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);

    });

    updateOrderSummary();
}


// =====================================
// 4. UPDATE ORDER SUMMARY
// =====================================

function updateOrderSummary() {

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const deliveryFee = cart.length > 0 ? 40 : 0;

    const tax = subtotal * 0.05;

    const grandTotal = subtotal + deliveryFee + tax;

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;

    deliveryFeeElement.textContent = `₹${deliveryFee}`;

    taxElement.textContent = `₹${tax.toFixed(2)}`;

    grandTotalElement.textContent = `₹${grandTotal.toFixed(2)}`;
}


// =====================================
// 5. UPDATE ITEM QUANTITY
// =====================================

async function updateQuantity(foodId, quantity) {

    try {

        const response = await fetch(
            `${API_URL}/update/${foodId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    quantity: quantity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Quantity update failed");
        }

        cart = data.cart.items;

        displayCart();

    } catch (error) {

        console.error("Update quantity error:", error);
        alert(error.message);

    }
}


// =====================================
// 6. REMOVE ITEM FROM CART
// =====================================

async function removeCartItem(foodId) {

    try {

        const response = await fetch(
            `${API_URL}/remove/${foodId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to remove item");
        }

        cart = data.cart.items;

        displayCart();

    } catch (error) {

        console.error("Remove item error:", error);
        alert(error.message);

    }
}


// =====================================
// 7. HANDLE CART BUTTONS
// =====================================

cartItemsContainer.addEventListener("click", async function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const foodId = Number(button.dataset.id);

    const selectedItem = cart.find(
        item => item.foodId === foodId
    );

    if (!selectedItem) return;

    if (button.classList.contains("increase-quantity")) {

        await updateQuantity(
            foodId,
            selectedItem.quantity + 1
        );

    }

    else if (button.classList.contains("decrease-quantity")) {

        if (selectedItem.quantity === 1) {

            await removeCartItem(foodId);

        } else {

            await updateQuantity(
                foodId,
                selectedItem.quantity - 1
            );

        }

    }

    else if (button.classList.contains("remove-cart-item")) {

        await removeCartItem(foodId);

    }

});


// =====================================
// 8. CHECKOUT BUTTON
// =====================================

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "checkout.html";

});


// =====================================
// 9. INITIALIZE CART
// =====================================

fetchCart();
