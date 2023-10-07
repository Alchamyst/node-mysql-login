const dotenv = require('dotenv');
const express = require('express');
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

database.connect( (error) => {
    if(error){
        console.log(error);
    }
    else {
        console.log("MySQL Connected...")
    }
});

app.get("/", (req, res) => {
    res.send("<h1> Home Page</h1>");
});

app.listen(9000, () => {
    console.log("Server started on Port 9000");
});