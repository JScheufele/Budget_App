'use strict';
// Database imports
const pgPool = require("./db/pgWrapper");
const tokenDB = require("./db/tokenDB")(pgPool);
const budgetDB = require("./db/budgetDB")(pgPool);
var render = require('co-views')('views');
var util = require('util');
global.__basedir = __dirname;
var session = require('express-session');

// OAuth imports
const oAuthService = require("./auth/tokenService")(budgetDB, tokenDB);
const oAuth2Server = require("node-oauth2-server");
var oAuthRequest = oAuth2Server.Request;
var oAuthResponse = oAuth2Server.Response;
//var http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.engine('ejs', require('ejs').renderFile);

app.use(session({
    key: 'user_sid',
    secret: 'budgetsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));



const port = 1337;
//oauth server
app.oauth = oAuth2Server({
    model: oAuthService,
    accessTokenLifetime: 3600,
	grants: ["password"],
	debug: true,
});

// Auth and routes
const authenticator = require("./auth/authenticator")(budgetDB,tokenDB);
const routes = require("./auth/routes")(
	express.Router(),
	app,
    authenticator,
);

// html Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(app.oauth.errorHandler());
app.use("/auth", routes);

// Postgres
var pgp = require('pg-promise')();

/*const dbConfig = {
	host: 'localhost',
	port: 1377,
	database: 'budget_db',
	user: 'postgres',
	password: ''                                                                         
};
*/
//var db = pgp(dbConfig);

//Pages

app.use(express.static('public'));
app.use('/SignUpModal', express.static(__dirname + '/SignUpModal'));
app.use('/Resources', express.static(__dirname+ '/Resources'));
                                                         
function messages(req,res,next){
    var message;
    res.locals.message = message;
    next();
    }

//app.get('/form',messages, (req, res) => {
//        res.render('/form');
//});
app.get('/form', messages, (req, res) => {
    //var message=req.body;
    //var message = req.session.message;

    if (req.session.loggedin) {
        res.locals.message = req.session.message;
        res.redirect('auth/graphData')
        //res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.locals.message = req.session.message;
        res.render('views/login.ejs', {user_email: req.session.username, message: req.session.message });
    }    

});

app.get('/logout',  (req, res) => {
    req.session.loggedin=false;
    res.locals.message = '';
    res.render('views/login.ejs');    

});
app.get('/login', messages, (req, res) => {
    res.locals.message = '';
    res.render('views/login.ejs');

});
//console.log('After login')
app.get('/home', (req, res) => {
    res.locals.message = '';
    if (req.session.loggedin) {
        res.redirect('auth/graphData', { user_email: req.session.username,message: req.session.message})
        //res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.locals.message = 'Please login to view this page!';
        res.render('views/login.ejs');
    }
    
});

//console.log('After home')

/*router.get('/account', function (req, res) {
    res.sendFile(path.join(__dirname + '/accountPage.html'));
});*/

app.get('/account', function(req, res) {
	res.locals.message = '';
    if (req.session.loggedin) {
        res.render('views/accountPage.ejs', { user_email: req.session.username })
        //res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.locals.message = 'Please login to view this page!';
        res.render('views/login.ejs');
    }
})
//console.log('After account')
app.use('/login', router);
app.listen(port, () => {
    console.log('app listening at http://localhost:1337/login')
})
console.log('After listen')

app.get('/account', (req,res) => {
	res.locals.message='';
	if (req.session.loggedin)
	{
		res.render('views/accountPage.ejs', {user_email: req.session_username})
	}
	else
	{
		res.locals.message = 'Please login to view this page!';
		res.render('views/login.ejs');
	}
})


app.get('/views/accountPage', function(req, res)
{
	var query1 = `SELECT amount FROM users WHERE user_name = cpearne;`
	var query2 = `SELECT amount FROM regular_transactions WHERE user_name = cpearne;`
	var query3 = `SELECT amount FROM transactions WHERE user_name = cpearne;`
	var query4 = `SELECT user_name FROM users WHERE user_name = cpearne;`

	db.task('get-everything', task => {
        return task.batch([
            task.any(query1),
			task.any(query2),
			task.any(query3),
			task.any(query4)
        ]);
    })
	.then(info => {
    	res.render('/views/accountPage',{
				title: "Account Page",
				income: info[0],
				monthly: info[1],
				one_time: info[2],
				user_name: info[3]
			})
	})
	.catch(err => {
		console.log('error', err);
		response.render('/views/accountPage', {
			title: 'Account Page',
			income: '',
			monthly: '',
			one_time: '',
			user_name: ''
		})
	});
});

app.post('/views/accountPage'), function(req,res)
{
	var user_name = req.body.user_name;
	var expense_amount = req.body.expense_amount;
	var selection = req.body.categories;
	var with_who = req.body.with_who;
	var description = req.body.description;
	var date = req.body.date;
	var insert_statement;
	if(selection == "monthly subscription")
	{
		insert_statement= `INSERT INTO regular_transactions(amount, with_who, description, transaction_date) VALUES ('${expense_amount}', '${with_who}', '${description}', '${date}') WHERE '${user_name}' = user_name;`
	}
	else if(selection == "one time expense")
	{
		insert_statement= `INSERT INTO transactions(amount, with_who, description, transaction_date) VALUES ('${expense_amount}', '${with_who}', '${description}', '${date}') WHERE '${user_name}' = user_name;`
	}

	db.task('get-everything', task => {
        return task.batch([
			task.any(insert_statement)
        ]);
    })
}

app.post('/views/accountPage'), function(res,req)
{
	var user_name = req.body.user_name;
	var income_amount = req.body.income_amount;
	console.log(user_name);
	console.log(income_amount);
	var insert_income = `INSERT INTO users(amount) VALUES ('${income_amount}') WHERE '${user_name}' = user_name;`

	db.task('get-everyting', task => {
		return task.batch([
			task.any(insert_income)
		]);
	})
}


