const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({ path: "backend/config/config.env" })
}

module.exports = app;