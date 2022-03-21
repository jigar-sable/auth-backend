const express = require("express");
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({ path: "backend/config/config.env" })
}

app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});

// error middleware
app.use(errorMiddleware);

module.exports = app;