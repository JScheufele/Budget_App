const { response } = require("express");

let budgetDB;
let tokenDB;

module.exports = (injectedbudgetDB, injectedTokenDB) => {
	budgetDB = injectedbudgetDB;
	tokenDB = injectedTokenDB;

	return {
		getClient: getClient,
		saveAccessToken: saveAccessToken,
		getUser: getUser,
		grantTypeAllowed: grantTypeAllowed,
		getAccessToken: getAccessToken,
	};
};

function getClient(clientID, clientSecret, cbFunc) {
	const client = {
		clientID,
		clientSecret,
		grants: null,
		redirectUris: null,
	};

	cbFunc(false, client);
}

function grantTypeAllowed(clientID, grantType, cbFunc) {
	cbFunc(false, true);
}

function getUser(username, password, cbFunc) {
	console.log("in get user "+username+" password "+password);

	budgetDB.getUser(username, password, cbFunc);
}

function saveAccessToken(accessToken, clientID, expires, user, cbFunc) {
	console.log("Save Access Token"+user.id+" User: "+user.accessToken);
	
	tokenDB.saveAccessToken(accessToken, user.user_id, cbFunc);
}

/*function getAccessToken(bearerToken, cbFunc) {
	tokenDB.getUserIDFromBearerToken(bearerToken, (userID) => {
		const accessToken = {
			user: {
				id: userID,
			},
			expires: null,
		};

		cbFunc(userID === null, userID === null ? null : accessToken);
	});
}
*/
function getAccessToken(bearerToken) {
    tokenDB.getUserIDFromBearerToken(bearerToken, (userID) => {
        const accessToken = {
            user: {
                id: userID,
            },
            expires: null,
        };

        cbFunc(userID === null, userID === null ? null : accessToken);
    });
}
