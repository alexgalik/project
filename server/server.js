const express = require('express') ;
const mysql = require('mysql') ;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local');

const passport = require("passport");
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const app = express();
app.use(passport.initialize());


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

function validate(data) {
    let errors = {};
    if (data.title === '') errors.title = "Can't be empty";
    if (data.text === '') errors.text = "Can't be empty";
    const isValid = Object.keys(errors).length === 0
	return {errors, isValid};
}

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'projectdb'
});

//////////////////LOGIN SETUP////////////////////////////////////////////////

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeader(),
    secretOrKey : 'mysecretKey'
};

const localLogin = new LocalStrategy(function(username, password, done) {
    connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
        if (err)
            return done(err);
        if (!rows.length) {
            return done(null, false, { message: 'Your login details could not be verified. Please try again.' }); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, { message: "Your login details could not be verified. Please try again." }); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, rows[0]);
    });
});


const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    console.log('payload received', payload);
    connection.query("SELECT * FROM users WHERE id = ?",[payload.id], function(err, rows){
        if (err) { return done(err, false); }

        if (rows[0]) {
            done(null, rows[0]);
        } else {
            done(null, false);
        }
    });
})

passport.use(jwtLogin);
passport.use(localLogin);

function generateToken(user) {
    return jwt.sign(user, jwtOptions.secretOrKey, {
        expiresIn: 10080 // in seconds
    });
}

function setUserInfo(request) {
    return {
        id: request.id,
        username: request.username,
        password: request.password
    }
};

const requireLogin = passport.authenticate('local', { session: false });

//////////////ROUTES LOGIN///////////////////////////////////////////////////

app.post('/api/auth',requireLogin, function(req,res,next){
    let userInfo = setUserInfo(req.user);
	res.status(200).json({
		token: 'JWT' + generateToken(userInfo),
        user: userInfo
	})
})

////////////// ROUTES POSTS/////////////////////////////////////////////////


app.get('/api/news', (req, res) =>{
	connection.query("SELECT * FROM news", function(error, rows, fields){
		if (error){
			console.log('Error');
		} else{
			res.json({rows});
		}
	})
});

app.get('/api/news/:news_id', (req, res) => {
	var id = req.params.news_id;
	connection.query("SELECT * FROM news WHERE news_id = ?", [id], function (error, rows) {
        if (error){
            console.log('Error');
        } else{
            res.send(rows);
        }
    })
});

app.post('/api/news', (req, res) => {
	const {title, text} = req.body;
	const sql = "INSERT INTO `news` (`news_id`, `ntext`, `ntitle`) VALUES (NULL, '"+title+"', '"+text+"')";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Record confirmed");
    })
	res.sendStatus(200);
});

app.put('/api/news/:news_id', (req, res) => {
	const {errors, isValid} = validate(req.body);
    const id = req.params.news_id;
	if (isValid){
		const {news_id, title, text} = req.body;
		connection.query("UPDATE news SET ntitle = ?, ntext = ? WHERE news_id = ?", [title, text, news_id], function (err, rows, result) {
			if (err) throw err;
			res.sendStatus(200);
        })
	}
})

app.delete('/api/news/:news_id', function (req, res) {
    let id = req.params.news_id;
    connection.query('DELETE FROM news WHERE news_id = ?',[id], function (error, results, fields) {
        if (error) throw error;
        console.log('deleted ' + results.affectedRows + ' rows');
    })
	res.json({});
});

app.use((req, res) => {
	res.status(404).json({
		errors:{
			global: "Oops, something went wrong"
		}
	})
});

connection.connect(function(error){
    if (!error){
        app.listen(8080, () => console.log('Server is running on localhost:8080'));
    } else{
        console.log('Error:', error);
    }
});