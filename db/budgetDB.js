let pgPool;

module.exports = (injectedPgPool) => {
	pgPool = injectedPgPool;

	return {
		register: register,
        getUser: getUser,
        getUser1: getUser1,
        isValidUser: isValidUser,
        updateTransaction:updateTransaction,
        updateIncome:updateIncome,
        updateExpense:updateExpense,
        updateSavings:updateSavings,
        deleteIncome:deleteIncome,
        deleteExpense:deleteExpense,
        deleteSavings:deleteSavings,
	};
};

var crypto = require("crypto");

function register(username, password, cbFunc) {
	var shaPass = crypto.createHash("sha256").update(password).digest("hex");

	const query = `INSERT INTO users (username, password) VALUES ('${username}', '${shaPass}')`;

	pgPool.query(query, cbFunc);
}

function getUser(username, password, cbFunc) {
	var shaPass = crypto.createHash("sha256").update(password).digest("hex");

	const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${shaPass}'`;


	pgPool.query(getUserQuery, (error, response) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);

	});

  
}
function updateTransaction(req, cbFunc) {
    let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

    var cDate=year + "-" + month + "-" + date;
	const query = `INSERT INTO transactions (user_id, name, description, initial_date, period_days, amount) VALUES (${req.session.userId}, '${req.body.incomeName}', 'salary of the user','${cDate}', 30, ${req.body.income_amount} )`;

	pgPool.query(query, cbFunc);
}
function deleteIncome(req, cbFunc){
    const query = `DELETE FROM income WHERE income_id = (${req.body.incomeId})`;
    pgPool.query(query, cbFunc);
}
function deleteExpense(req, cbFunc){
    const query = `DELETE FROM expenses WHERE expense_id = (${req.body.expenseId})`;
    pgPool.query(query, cbFunc);
}
function deleteSavings(req, cbFunc){
    const query = `DELETE FROM savings_goals WHERE goal_id = (${req.body.savingsId})`;
    pgPool.query(query, cbFunc);
}
function updateIncome(req, cbFunc) {
    var weekly = false;
    var biweekly = false;
    var monthly = false;
    var yearly = false;
    var recurring = true;
    if (req.body.income_category=="one_time")
    {
        recurring = false;
    }
    if (req.body.income_period=="weekly")
    {
        weekly = true;
    }
    else if (req.body.income_period=="biWeekly")
    {
        biweekly = true;
    }   
    else if (req.body.income_period=="monthly")
    {
        monthly = true;
    } 
    else if (req.body.income_period=="yearly")
    {
        yearly = true;
    } 
	const query = `INSERT INTO income (user_id, income_name, income_amount, income_type_id, recurring, weekly, biweekly, monthly, yearly) VALUES (${req.session.userId}, '${req.body.incomeName}', ${req.body.income_amount}, ${req.body.income_type},${recurring}, ${weekly}, ${biweekly}, ${monthly}, ${yearly})`;

	pgPool.query(query, cbFunc);
}

function updateExpense(req, cbFunc) {


    var weekly = false;
    var biweekly = false;
    var monthly = false;
    var yearly = false;
    var recurring = true;
    if (req.body.expense_category=="one_time")
    {
        recurring = false;
    }
    if (req.body.expense_period=="weekly")
    {
        weekly = true;
    }
    else if (req.body.expense_period=="biWeekly")
    {
        biweekly = true;
    }   
    else if (req.body.expense_period=="monthly")
    {
        monthly = true;
    } 
    else if (req.body.expense_period=="yearly")
    {
        yearly = true;
    } 
	const query = `INSERT INTO expenses (user_id, expense_name, expense_amount, expense_type_id, recurring, weekly, biweekly, monthly, yearly) VALUES (${req.session.userId}, '${req.body.expenseName}', ${req.body.expense_amount}, ${req.body.expense_type},${recurring}, ${weekly}, ${biweekly}, ${monthly}, ${yearly})`;

	pgPool.query(query, cbFunc);
}

function updateSavings(req, cbFunc) {
    const query = `INSERT INTO savings_goals (user_id, goal_amount, date_started, complete) VALUES (${req.session.userId}, ${req.body.goal_amount}, NOW(), false)`;
    pgPool.query(query,cbFunc);
}

function getUser1(username, password, req, res) {

    const { Pool, Client } = require("pg");

    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "budget_db",
        password: "Paul6515",
        port: 5432,
    });



    var shaPass = crypto.createHash("sha256").update(password).digest("hex");

    const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${shaPass}'`;

    pool.query(getUserQuery, (err, res) => {
        console.log(err, res);

        if (err) {
            throw err;
        }
        
        if (res.rowCount == 0) {
            console.log("no user found");
        }
        
        pool.end();

        res.redirect('/home');


    });



}
function isValidUser(username, cbFunc) {
	const query = `SELECT * FROM users WHERE username = '${username}'`;

	const checkUsrcbFunc = (response) => {
		const isValidUser = response.results
			? !(response.results.rowCount > 0)
			: null;

		cbFunc(response.error, isValidUser);
	};

	pgPool.query(query, checkUsrcbFunc);
}
