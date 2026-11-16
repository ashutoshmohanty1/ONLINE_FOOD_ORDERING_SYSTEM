
// =====================================
// 1. FOOD DATA (TEMPORARY)
// =====================================

window.foodItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        rating: 4.5,
        description: "Classic pizza with mozzarella cheese and fresh basil.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600"
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 149,
        rating: 4.7,
        description: "Juicy burger with cheese, lettuce and fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 3,
        name: "Chicken Biryani",
        category: "Biryani",
        price: 299,
        rating: 4.8,
        description: "Aromatic basmati rice cooked with delicious spices.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600"
    },
    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        rating: 4.6,
        description: "Delicious pizza topped with cheese and pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600"
    },
    {
        id: 5,
        name: "Classic Veg Burger",
        category: "Burger",
        price: 129,
        rating: 4.3,
        description: "Crispy vegetable patty with fresh lettuce and sauce.",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600"
    },
    {
        id: 6,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 179,
        rating: 4.9,
        description: "Rich chocolate cake with creamy chocolate frosting.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    },
    {
        id: 7,
        name: "Cold Coffee",
        category: "Drinks",
        price: 99,
        rating: 4.4,
        description: "Refreshing chilled coffee with creamy milk.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
    },
    {
        id: 8,
        name: "Chicken Dum Biryani",
        category: "Biryani",
        price: 329,
        rating: 4.8,
        description: "Traditional dum-cooked biryani with rich flavours.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600"
    },
    {
        id: 9,
        name: "Ice Cream",
        category: "Dessert",
        price: 89,
        rating: 4.5,
        description: "Delicious and creamy ice cream dessert.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"
    },
    {
        id: 10,
        name: "Farmhouse Pizza",
        category: "Pizza",
        price: 399,
        rating: 4.7,
        description: "Loaded with fresh vegetables, cheese and olives.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
    },
    {
        id: 11,
        name: "Double Cheese Burger",
        category: "Burger",
        price: 199,
        rating: 4.8,
        description: "Double patty burger with extra melted cheese.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 12,
        name: "Paneer Biryani",
        category: "Biryani",
        price: 249,
        rating: 4.6,
        description: "Flavourful basmati rice with spicy paneer.",
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/FOOD_CATALOG/IMAGES/CMS/2026/1/2/34c3537c-6af4-4410-92f2-1f02ce07bd14_20e69b63-c354-466a-8eaf-faac394c35ac.jpg_compressed"
    },
    {
        id: 13,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 89,
        rating: 4.5,
        description: "Freshly squeezed orange juice.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"
    },
    {
        id: 14,
        name: "Chocolate Brownie",
        category: "Dessert",
        price: 129,
        rating: 4.7,
        description: "Rich chocolate brownie with a soft centre.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
    },
    {
        id: 15,
        name: "French Fries",
        category: "Snacks",
        price: 99,
        rating: 4.4,
        description: "Crispy golden french fries with seasoning.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600"
    },
    {
        id: 16,
        name: "Paneer Tikka Pizza",
        category: "Pizza",
        price: 329,
        rating: 4.7,
        description: "Pizza topped with spicy paneer tikka and mozzarella.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
    },
    {
        id: 17,
        name: "Farmhouse Cheese Pizza",
        category: "Pizza",
        price: 379,
        rating: 4.8,
        description: "Loaded with capsicum, onion, tomato and cheese.",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600"
    },
    {
        id: 18,
        name: "Crispy Chicken Burger",
        category: "Burger",
        price: 179,
        rating: 4.6,
        description: "Crispy chicken patty with lettuce and creamy sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 19,
        name: "Classic Cheese Burger",
        category: "Burger",
        price: 159,
        rating: 4.5,
        description: "Grilled burger with cheese and fresh vegetables.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600"
    },
    {
        id: 20,
        name: "Veg Dum Biryani",
        category: "Biryani",
        price: 199,
        rating: 4.5,
        description: "Aromatic rice with vegetables and traditional spices.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600"
    },
    {
        id: 21,
        name: "Special Chicken Biryani",
        category: "Biryani",
        price: 349,
        rating: 4.9,
        description: "Special dum biryani served with rich spices.",
        image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/FOOD_CATALOG/IMAGES/CMS/2026/2/26/1fea9d28-c922-4e22-87f9-504b9767e338_67480af1-084e-4e83-93c3-eec68429a173.jpg"
    },
    {
        id: 22,
        name: "Strawberry Milkshake",
        category: "Drinks",
        price: 129,
        rating: 4.6,
        description: "Creamy strawberry milkshake served chilled.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600"
    },
    {
        id: 23,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 89,
        rating: 4.5,
        description: "Fresh and refreshing orange juice.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"
    },
    {
        id: 24,
        name: "Iced Coffee",
        category: "Drinks",
        price: 119,
        rating: 4.7,
        description: "Chilled coffee with milk and a creamy finish.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
    },
    {
        id: 25,
        name: "Red Velvet Cake",
        category: "Dessert",
        price: 199,
        rating: 4.8,
        description: "Soft red velvet cake with cream cheese frosting.",
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600"
    },
    {
        id: 26,
        name: "Chocolate Brownie",
        category: "Dessert",
        price: 129,
        rating: 4.7,
        description: "Rich chocolate brownie with a soft centre.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
    },
    {
        id: 27,
        name: "Vanilla Ice Cream",
        category: "Dessert",
        price: 89,
        rating: 4.5,
        description: "Smooth and creamy vanilla ice cream.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"
    },
    {
        id: 28,
        name: "French Fries",
        category: "Snacks",
        price: 99,
        rating: 4.5,
        description: "Crispy golden french fries with seasoning.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600"
    },
    {
        id: 29,
        name: "Club Sandwich",
        category: "Snacks",
        price: 149,
        rating: 4.6,
        description: "Fresh sandwich layered with vegetables and cheese.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600"
    },
    {
        id: 30,
        name: "Chicken Wings",
        category: "Snacks",
        price: 229,
        rating: 4.8,
        description: "Crispy chicken wings tossed in spicy sauce.",
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600"
    }
];

