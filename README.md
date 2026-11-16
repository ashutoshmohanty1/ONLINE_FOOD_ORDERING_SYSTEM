Online Food Ordering System
A full-stack online food ordering web application that allows customers to browse food, manage a shopping cart, save delivery addresses, place orders, and track their order history.

Features
- Customer registration and login
- Secure password hashing
- JWT authentication using HTTP-only cookies
- Customer profile
- Browse and search food items
- Food category filtering
- Add food items to cart
- Update item quantities and remove cart items
- Manage delivery addresses
- Place orders using Cash on Delivery (COD)
- View order history and order status
- Customer dashboard with order statistics and recent orders
- Dashboard order notifications

Technology Stack
Frontend
- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts (Poppins)

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- CORS
- dotenv

Project Structure
online_food_ordering_system/
│
├── client/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── customer-dashboard.html
│   ├── profile.html
│   ├── explore-food.html
│   ├── cart.html
│   ├── checkout.html
│   └── my-orders.html
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── model/
│   │   ├── router/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── README.md
└── .gitignore

Requirements
- Node.js (LTS version recommended)
- npm
- MongoDB local server or MongoDB Atlas
- Visual Studio Code (recommended)
- Live Server extension for VS Code
Installation and Setup
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd online_food_ordering_system
Replace YOUR_GITHUB_REPOSITORY_URL with your GitHub repository URL.
2. Install backend dependencies
cd server
npm install
3. Configure environment variables
Create a .env file inside the server/ directory.

Add the environment variable names expected by your backend configuration. For example:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
Use the exact variable names referenced in your server/src/config/db.js and authentication code. The values above are placeholders. Do not commit your real .env file.
4. Start the backend
From the server/ directory, run the start script configured in package.json:
npm start
If no start script is configured, run:
node server.js
The backend API is expected to run on port 3000 in the current local development setup.
5. Run the frontend
Open the client/ folder in Visual Studio Code and start Live Server using index.html.

Current local development URLs:
Frontend: http://127.0.0.1:5500
Backend:  http://127.0.0.1:3000
Keep the frontend hostname and port consistent with the CORS origin configured in the backend. If you change them, update the backend CORS settings and frontend API URL.
API Overview
The API base path is /api.
Module	Method	Endpoint	Description
Authentication	POST	/api/auth/register	Register a customer
Authentication	POST	/api/auth/login	Log in a customer
Authentication	GET	/api/auth/profile	Get the logged-in customer's profile
Authentication	POST	/api/auth/logout	Log out
Cart	POST	/api/cart/add	Add an item to the cart
Cart	GET	/api/cart	Get the customer's cart
Cart	PUT	/api/cart/update/:foodId	Update cart item quantity
Cart	DELETE	/api/cart/remove/:foodId	Remove an item from the cart
Cart	DELETE	/api/cart/clear	Clear the cart
Addresses	POST	/api/addresses/add	Add a delivery address
Addresses	GET	/api/addresses	Get saved addresses
Addresses	PUT	/api/addresses/default/:addressId	Set the default address
Addresses	DELETE	/api/addresses/:addressId	Delete an address
Orders	POST	/api/orders/place	Place an order
Orders	GET	/api/orders/my-orders	Get the customer's orders


Protected endpoints require the customer to be authenticated. Refer to the route and controller files for the exact request body and response formats.
Order and Payment Information
- Checkout currently supports Cash on Delivery (COD).
- Orders are initially created with a pending payment status.
- Order statuses include confirmed, preparing, out for delivery, delivered, and cancelled.
- Estimated delivery time is an estimate; an order is only delivered when its status is updated accordingly.
Security
- Keep .env files and secret values private.
- Do not commit node_modules/.
- Passwords should be stored as hashes, never as plain text.
- Authentication tokens are stored in HTTP-only cookies.
- Validate user input and verify authorization on the backend.
- Before production deployment, configure HTTPS, secure cookies, production CORS settings, and trusted server-side food prices.

Author
Ashutosh Mohanty
Developed as a full-stack web development project.