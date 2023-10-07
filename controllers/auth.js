const database = require('../mysql/database');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password ) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password.'
            });
        }

        database.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
            if( !result || !(await bcrypt.compare(password, result[0].password)) ) {
                return res.status(401).render('login', {
                    message: 'Incorrect email or password.'
                });
            };
            
            const id = result[0].id;
            const token = jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };

            res.cookie('user-session', token, cookieOptions);
            res.status(200).redirect("/");
        });

    } catch (error) {
        console.log(error);
    } 
}

exports.register = (req, res) => {
    const { name, email, password, passwordconfirm } = req.body;

    database.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if( error ) return  console.log(error);

        if( result.length > 0 ) {
            return res.render('register', {
                message: 'That email is already registered.'
            });
        }
        
        if( password !== passwordconfirm ){
            return res.render('register', {
                message: 'Passwords do not match.'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        database.query('INSERT INTO users SET ? ', { name: name, email: email, password: hashedPassword }, (error, result) => {
            if(error) return console.log(error);
            
            return res.render('register', {
                message: 'User registered'
            });
        })
    });
};