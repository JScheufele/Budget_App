const { response } = require("express");
let budgetDB;
let tokenDB;
let app;

module.exports = (injectedbudgetDB, injectedTokenDB) => {
	budgetDB = injectedbudgetDB;
	tokenDB = injectedTokenDB;

	return {
		registerUser: registerUser,
		login: login,
        getAccessToken: getAccessToken,	
        validateToken: validateToken,
		checkUser: checkUser,
		updateIncome: updateIncome,
		updateExpense: updateExpense,
		updateSavings: updateSavings,
		deleteIncome: deleteIncome,
		deleteExpense: deleteExpense,
		deleteSavings: deleteSavings,
		
	};
};
function updateIncome(req, res ) {
	//budgetDB.updateIncome(req, res);
	budgetDB.updateIncome(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Income!",
			response.error
		);
	});
    //console.log(res);
}
function updateSavings(req,res) {
	budgetDB.updateSavings(req, (response) => {
		sendResponse(
			res,
			response.error == undefined ? "Success!!" : "Something went wrong updating savings goal!",
			response.error
		);
	});
}
function updateExpense(req, res ) {
	//budgetDB.updateIncome(req, res);
	budgetDB.updateExpense(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Expense!",
			response.error
		);
	});
    //console.log(res);
}
function deleteIncome(req, res){
	budgetDB.deleteIncome(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Expense!",
			response.error
		);
	});
}
function deleteExpense(req, res){
	budgetDB.deleteExpense(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Expense!",
			response.error
		);
	});
}
function deleteSavings(req, res){
	budgetDB.deleteSavings(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Expense!",
			response.error
		);
	});
}
function checkUser(req, res) {
    budgetDB.getUser1(req.body.email, req.body.password, req, res);

    console.log(res);
}

function registerUser(req, res) {
	budgetDB.isValidUser(req.body.username, (error, isValidUser) => {
		if (error || !isValidUser) {
			const message = error
				? "Something went wrong 1!"
				: "This user already exists!";
				req.session.loggedin = false;
				req.session.message = message;
			sendResponse(res, message, error);
			return;
			
		}

		budgetDB.register(req.body.username, req.body.password, (response) => {
			req.session.loggedin = false;
			sendResponse(
				res,
				response.error === undefined ? "Success!!" : "Something went wrong 2!",
				response.error
			);
		});
	});
}

function validateToken(req, res) {
    console.log("Bearer token: "+req.body.bearertoken);
	tokenDB.getUserIDFromBearerToken(req.body.bearertoken,(response) => {
		sendResponse(
			res,
			response.error === undefined ? response.results.rows[0] : "Something went wrong!",
			response.error
		);


		});

}

function getAccessToken(bearerToken, cbFunc) {
    console.log("Bearer token: " + bearerToken);
    tokenDB.getUserIDFromBearerToken(bearerToken, (userID) => {
        const accessToken = {
            user: {
                id: userID,
            },
            expires: null,
        };
        console.log("access token: " + accessToken.user.id);
        cbFunc(userID === null, userID === null ? null : accessToken);
    });
}

function login(req, res) {
    console.log("In login");
    
}
/*function getIncome(req, res){
	budgetDB.getIncome(req, (response) => {
		sendResponse(
			res,
			response.error === undefined ? "Success!!" : "Something went wrong Updating Expense!",
			response.error
		);
	});
}*/
function sendResponse(res, message, error) {
	console.log("in sendResponse");
	/*res.status(error !== undefined ? 400 : 200).json({
		message: message,
		error: error,
	});*/
	res.redirect('/form');

}
