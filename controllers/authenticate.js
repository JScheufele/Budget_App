const { response } = require("express");
let budgetDB;
let tokenDB;

module.exports = (injectedbudgetDB, injectedTokenDB) => {
    budgetDB = injectedbudgetDB;
    tokenDB = injectedTokenDB;

    return {
        checkUser: checkUser,
    };
    
};
function checkUser(req, res) {
    tokenDB.getUser(req.body.email, req.body.password, response);

    console.log(response);
}
