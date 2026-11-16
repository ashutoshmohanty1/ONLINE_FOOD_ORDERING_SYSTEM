const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/user.router');
const cartRouter = require('./router/cart.router');
const addressRouter = require('./router/address.router');
const orderRouter = require('./router/order.router');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/orders', orderRouter);

module.exports = app;