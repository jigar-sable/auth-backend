const express = require("express");
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({ path: "backend/config/config.env" })
}

app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});

// import routes
const user = require('./routes/userRoute');

app.use('/api/v1', user);


// error middleware
app.use(errorMiddleware);

module.exports = app;