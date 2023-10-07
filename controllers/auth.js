const database = require('../mysql/database');
const mysql = require("mysql2");
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordconfirm } = req.body;

    database.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if( error ) {
            console.log(error);
        }

        if( result.length > 0 ) {
            return res.render('register', {
                message: 'That email is already registered.'
            });
        } else if( password !== passwordconfirm ){
            return res.render('register', {
                message: 'Passwords do not match.'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        res.send("testing");
    });
};