var crypto = require("crypto");
var ejs = require('ejs');
const { response } = require("express");
const path = require('path');

const { Pool, Client } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "budget_db",
    password: "Paul6515",
    port: 5432,
});

module.exports = (router, app, authenticator) => {

    router.get('/graphData', function (req, res) {
        res.locals.message = '';
        const queryType = `SELECT income_amount, recurring, weekly,biweekly,monthly,yearly FROM income where user_id = ${req.session.userId}; SELECT expense_amount,weekly,biweekly,monthly,yearly FROM expenses where user_id = ${req.session.userId}; SELECT goal_amount from savings_goals where user_id = ${req.session.userId}; `; 
        //pool.query(queryType, [res]);
        pool.query(queryType, (error, results) => {
            //console.log(error, response);

            if (error) {
                throw error;
            }
            if(!results[0].rows.length&&!results[1].rows.length&&!results[2].rows.length)
            {
                var fakeY=JSON.stringify([{"Value":0,"Date":Date.now()},{"Value":0,"Date":Date.now()}]);
                var fakeS=JSON.stringify([{"Value":0,"Date":Date.now()},{"Value":0,"Date":Date.now()}]);
                res.render(path.join(__basedir+'/views/homepage.ejs'),{user_email: req.session.username,message: req.session.message, yearly:fakeY, savings:fakeS});
            }
            else if(results[0].rows.length&&!results[1].rows.length&&!results[2].rows.length)
            {
                var incomeSum = 0;
                var monthlyIncomeSum = 0;
                for(var i=0; i < results[0].rows.length; i++){
                    if(results[0].rows[i].weekly){
                        incomeSum+=results[0].rows[i].income_amount*52;
                        monthlyIncomeSum+=results[0].rows[i].income_amount*4;
                    }
                    else if(results[0].rows[i].biweekly){
                        incomeSum+=results[0].rows[i].income_amount*26;
                        monthlyIncomeSum+=results[0].rows[i].income_amount*2;
                    }
                    else if(results[0].rows[i].monthly){
                        incomeSum+=results[0].rows[i].income_amount*12;
                        monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                    }
                    else if(results[0].rows[i].yearly||!(results[0].rows[i].recurring)){
                        incomeSum+=results[0].rows[i].income_amount*1;
                        //monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                    }
                }
                var responseData=JSON.stringify([{"Value":0, "Date":Date.now()},{"Value":incomeSum, "Date":Date.now()+24*60*60*1000*365}]);
                var fakeS=JSON.stringify([{"Value":0,"Date":Date.now()},{"Value":0,"Date":Date.now()}]);
                res.render(path.join(__basedir+'/views/homepage.ejs'),{user_email: req.session.username,message: req.session.message, yearly:responseData, savings:fakeS});
            }
            else if(!results[0].rows.length&&results[1].rows.length&&!results[2].rows.length)
            {
                var expenseSum = 0;
                var monthlyExpenseSum = 0;
                for(var i=0; i < results[1].rows.length; i++){
                    if(results[1].rows[i].weekly){
                        expenseSum+=results[1].rows[i].expense_amount*52;
                        monthlyExpenseSum+= results[1].rows[i].expense_amount*4;                    
                    }
                    else if(results[1].rows[i].biweekly){
                        expenseSum+=results[1].rows[i].expense_amount*26;
                        monthlyExpenseSum+= results[1].rows[i].expense_amount*2; 
                    }
                    else if(results[1].rows[i].monthly){
                        expenseSum+=results[1].rows[i].expense_amount*12;
                        monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                    }
                    else if(results[1].rows[i].yearly||!(results[1].rows[i].recurring)){
                        expenseSum+=results[1].rows[i].expense_amount*1;
                        //monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                    }
                }
                var responseData=JSON.stringify([{"Value":0, "Date":Date.now()},{"Value":expenseSum, "Date":Date.now()+24*60*60*1000*365}]);
                var fakeS=JSON.stringify([{"Value":0,"Date":Date.now()},{"Value":0,"Date":Date.now()}]);
                res.render(path.join(__basedir+'/views/homepage.ejs'),{user_email: req.session.username,message: req.session.message, yearly:responseData, savings:fakeS});
            }
            else if(results[0].rows.length&&results[1].rows.length&&!results[2].rows.length)
            {
                var incomeSum = 0;
            var monthlyIncomeSum = 0;
            for(var i=0; i < results[0].rows.length; i++){
                if(results[0].rows[i].weekly){
                    incomeSum+=results[0].rows[i].income_amount*52;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*4;
                }
                else if(results[0].rows[i].biweekly){
                    incomeSum+=results[0].rows[i].income_amount*26;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*2;
                }
                else if(results[0].rows[i].monthly){
                    incomeSum+=results[0].rows[i].income_amount*12;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                }
                else if(results[0].rows[i].yearly||!(results[0].rows[i].recurring)){
                    incomeSum+=results[0].rows[i].income_amount*1;
                    //monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                }
            }
            var expenseSum = 0;
            var monthlyExpenseSum = 0;
            for(var i=0; i < results[1].rows.length; i++){
                if(results[1].rows[i].weekly){
                    expenseSum+=results[1].rows[i].expense_amount*52;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*4;                    
                }
                else if(results[1].rows[i].biweekly){
                    expenseSum+=results[1].rows[i].expense_amount*26;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*2; 
                }
                else if(results[1].rows[i].monthly){
                    expenseSum+=results[1].rows[i].expense_amount*12;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                }
                else if(results[1].rows[i].yearly||!(results[1].rows[i].recurring)){
                    expenseSum+=results[1].rows[i].expense_amount*1;
                    //monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                }
            }
            var endOfYear=incomeSum-expenseSum;
            var responseData=JSON.stringify([{"Value":0, "Date":Date.now()},{"Value":endOfYear, "Date":Date.now()+24*60*60*1000*365}]);
            var fakeS=JSON.stringify([{"Value":0,"Date":Date.now()},{"Value":0,"Date":Date.now()}]);
            res.render(path.join(__basedir+'/views/homepage.ejs'),{user_email: req.session.username,message: req.session.message, yearly:responseData, savings:fakeS});
            }
            else{
            var incomeSum = 0;
            var monthlyIncomeSum = 0;
            for(var i=0; i < results[0].rows.length; i++){
                if(results[0].rows[i].weekly){
                    incomeSum+=results[0].rows[i].income_amount*52;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*4;
                }
                else if(results[0].rows[i].biweekly){
                    incomeSum+=results[0].rows[i].income_amount*26;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*2;
                }
                else if(results[0].rows[i].monthly){
                    incomeSum+=results[0].rows[i].income_amount*12;
                    monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                }
                else if(results[0].rows[i].yearly||!(results[0].rows[i].recurring)){
                    incomeSum+=results[0].rows[i].income_amount*1;
                    //monthlyIncomeSum+=results[0].rows[i].income_amount*1;
                }
            }
            var expenseSum = 0;
            var monthlyExpenseSum = 0;
            for(var i=0; i < results[1].rows.length; i++){
                if(results[1].rows[i].weekly){
                    expenseSum+=results[1].rows[i].expense_amount*52;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*4;                    
                }
                else if(results[1].rows[i].biweekly){
                    expenseSum+=results[1].rows[i].expense_amount*26;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*2; 
                }
                else if(results[1].rows[i].monthly){
                    expenseSum+=results[1].rows[i].expense_amount*12;
                    monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                }
                else if(results[1].rows[i].yearly||!(results[1].rows[i].recurring)){
                    expenseSum+=results[1].rows[i].expense_amount*1;
                    //monthlyExpenseSum+= results[1].rows[i].expense_amount*1; 
                }
            }
            var savingsGoal=results[2].rows[0].goal_amount;
            var endOfYear=incomeSum-expenseSum;
            //JSON.stringify ({monthlyIncomeAmount: monthlyIncomeSum, monthlyExpenseAmount: monthlyExpenseSum, monthlyDifference: monthlyIncomeSum-monthlyExpenseSum, yearlyIncome: incomeSum, yearlyExpense: expenseSum, yearlyDifference:  endOfYear})
            
        


           // var responseData =({"monthlyIncomeAmount": monthlyIncomeSum, "monthlyExpenseAmount": monthlyExpenseSum, "monthlyDifference": monthlyIncomeSum-monthlyExpenseSum, "yearlyIncome": incomeSum, "yearlyExpense": expenseSum, "yearlyDifference":  endOfYear});
            var responseData=JSON.stringify([{"Value":0, "Date":Date.now()},{"Value":endOfYear, "Date":Date.now()+24*60*60*1000*365}]);
            var savings=JSON.stringify([{"Value":savingsGoal, "Date":Date.now()}, {"Value":savingsGoal, "Date":Date.now()+24*60*60*1000*365}])
           res.render(path.join(__basedir+'/views/homepage.ejs'),{user_email: req.session.username,message: req.session.message, yearly:responseData, savings:savings});
           
            //res.render(path.join(__basedir+'/views/homepage.ejs'),{ user_email: req.session.username,message: req.session.message,dropdownIncomeTypeVals: results[0],dropdownExpenseTypeVals: results[1],incomeValues: results[2], expenseValues: results[3]});
            
        }
        })


    });
    router.get('/myBudget', function (req, res) {
        res.locals.message = '';
        const queryType = `SELECT income_type_id, income_type_name, income_type_group FROM income_types; SELECT expense_type_id, expense_type_name, expense_type_group FROM expense_types;SELECT * FROM income WHERE user_id=${req.session.userId};SELECT * FROM expenses WHERE user_id=${req.session.userId};SELECT * FROM savings_goals WHERE user_id=${req.session.userId} `;

        //pool.query(queryType, [res]);
        pool.query(queryType, (error, results) => {
            //console.log(error, response);

            if (error) {
                throw error;
            }

            res.render(path.join(__basedir+'/views/accountPage.ejs'),{ user_email: req.session.username,message: req.session.message,dropdownIncomeTypeVals: results[0],dropdownExpenseTypeVals: results[1],incomeValues: results[2], expenseValues: results[3],savingsValues: results[4]});
            
        })


    });
    router.get('/getIncome', function (req,res){
        res.locals.message = '';
            const query=`SELECT * FROM income WHERE user_id=${req.session.userId}`;
            
            pool.query(query, (error, results) => {
                if(error){
                    throw error;
                }
                var incomeValues=results;
                for(i=0;i<incomeValues.rows.length;i++){
                    req.document.getElementById("incomeDisplay").innerHTML+=incomeValues.rows[i].income_amount;
                }

            })
        }
    );
    router.post("/updateIncome", authenticator.updateIncome);
    router.post("/updateSavings", authenticator.updateSavings);
    router.post("/updateExpense", authenticator.updateExpense);    
    router.post("/register", authenticator.registerUser);
    router.post("/deleteIncome", authenticator.deleteIncome);
    router.post("/deleteExpense", authenticator.deleteExpense);
    router.post("/deleteSavings", authenticator.deleteSavings);
    router.post("/login", function (request, response) {
        //req.headers['grant_type'] = 'password';
        //req.headers['client_id'] = null;
        //req.headers['client_secret'] = null;
        //var grant = req.app.oauth.grant();
        

        var username = request.body.email;
        var password = request.body.password;
        var shaPass = crypto.createHash("sha256").update(password).digest("hex");

        const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${shaPass}'`;

        pool.query(getUserQuery, (error, results) => {
            //console.log(error, response);

            if (error) {
                throw error;
            }

            if (results.rowCount == 1) {
                request.session.loggedin = true;
                request.session.username = username;
                request.session.message = '';
                request.session.userId = results.rows[0].user_id;

                //results.render('/views/homepage', { user_email: username })

                response.redirect('/form');
            }
            else {
                //response.send('Incorrect Username and Password')
                //response.send('Incorrect Username and Password') 
                request.session.loggedin = false;
                request.session.message = 'Incorrect Username and Password';
                response.redirect('/form');
                
            }
            response.end();
            //pool.end();
        })


    });

    router.post("/check", authenticator.validateToken);
    router.post("/checkUser", authenticator.checkUser);
	return router;
};