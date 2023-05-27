const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const productData = require("./Products/products.controller");
const merekData = require("./Products/mereks.controller");
const authData = require('./Auth/auth.controller')
const userAuth = require('./User/index')
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Authentication
app.use('/api/', authData)

// user or admin
app.use('/api/', userAuth)

// Product
app.use("/api/products/", productData);
app.use("/api/mereks/", merekData);

// test

app.get('/', (req, res) => {
  res.send('Hello world')
})



// eslint-disable-next-line no-undef
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Aplication running in port ${port}`);
});
