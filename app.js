const express = require('express');
const dotenv = require('dotenv');
const mysql = require("mysql2");
const path = require('path');

dotenv.config({ path: './.env' });

const app = express();

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

database.connect( (error) => {
    if(error){
        console.log(error);
    }
    else {
        console.log("MySQL Connected...")
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(9000, () => {
    console.log("Server started on Port 9000");
});