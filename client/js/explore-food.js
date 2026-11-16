
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================
const foodItems = window.foodItems;
const foodGrid = document.getElementById("foodGrid");
const foodSearch = document.getElementById("foodSearch");
const searchButton = document.getElementById("searchButton");
const categoryList = document.getElementById("categoryList");
const foodCount = document.getElementById("foodCount");
const emptyMessage = document.getElementById("emptyMessage");


// =====================================
// 2. DISPLAY FOOD ITEMS
// =====================================

function displayFood(items) {

    foodGrid.innerHTML = "";

    foodCount.textContent =
        `${items.length} ${items.length === 1 ? "Item" : "Items"}`;

    emptyMessage.hidden = items.length !== 0;

    items.forEach(food => {

        const foodCard = document.createElement("div");

        foodCard.className = "food-card";

        foodCard.innerHTML = `
            <img
                src="${food.image}"
                alt="${food.name}"
                class="food-image"
            >

            <div class="food-card-content">

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${food.rating}</span>
                    <span class="food-category-label">
                        ${food.category}
                    </span>
                </div>

                <div class="food-card-bottom">

                    <span class="food-price">
                        ₹${food.price}
                    </span>

                    <button class="add-cart-btn" data-id="${food.id}">
                        <i class="fa-solid fa-plus"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        foodGrid.appendChild(foodCard);
    });
}


// =====================================
// 3. SEARCH FOOD
// =====================================

function searchFood() {

    const searchValue = foodSearch.value
        .trim()
        .toLowerCase();

    const activeCategory = document.querySelector(
        ".category-btn.active"
    );

    const selectedCategory = activeCategory.dataset.category;

    const filteredFood = foodItems.filter(food => {

        const matchesSearch =
            food.name.toLowerCase().includes(searchValue) ||
            food.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayFood(filteredFood);
}


// =====================================
// 4. SEARCH BUTTON AND INPUT
// =====================================

searchButton.addEventListener("click", searchFood);

foodSearch.addEventListener("input", searchFood);


// =====================================
// 5. CATEGORY FILTER
// =====================================

categoryList.addEventListener("click", function(event) {

    const clickedButton = event.target.closest(".category-btn");

    if (!clickedButton) return;

    document.querySelector(".category-btn.active")
        .classList.remove("active");

    clickedButton.classList.add("active");

    searchFood();
});


// =====================================
// 6. INITIAL FOOD DISPLAY
// =====================================

displayFood(foodItems);






 // =====================================
 // 7. CART FUNCTIONALITY (MONGODB)
 // =====================================

const API_URL = "http://127.0.0.1:3000/api/cart";

// GET CART COUNT FROM DATABASE
async function updateCartCount() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch cart");
        }

        const totalItems = (data.cart?.items || []).reduce(
            (total, item) => total + item.quantity,
            0
        );

        const cartCount = document.querySelector(".cart-count");

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

    } catch (error) {
        console.error("Cart count error:", error);
    }
}


// ADD FOOD TO DATABASE CART
foodGrid.addEventListener("click", async function(event) {

    const addButton = event.target.closest(".add-cart-btn");

    if (!addButton) return;

    const foodId = Number(addButton.dataset.id);

    const selectedFood = foodItems.find(
        food => food.id === foodId
    );

    if (!selectedFood) return;

    try {
        addButton.disabled = true;

        const response = await fetch(`${API_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                foodId: selectedFood.id,
                name: selectedFood.name,
                price: selectedFood.price,
                image: selectedFood.image,
                quantity: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add food");
        }

        addButton.innerHTML =
            '<i class="fa-solid fa-check"></i> Added';

        await updateCartCount();

        setTimeout(() => {
            addButton.innerHTML =
                '<i class="fa-solid fa-plus"></i> Add to Cart';
            addButton.disabled = false;
        }, 1000);

    } catch (error) {
        console.error("Add to cart error:", error);
        alert(error.message);
        addButton.disabled = false;
    }
});


// INITIAL CART COUNT
updateCartCount();

