let pgPool;

module.exports = (injectedPgPool) => {
	pgPool = injectedPgPool;

	return {
		saveAccessToken: saveAccessToken,
		getUserIDFromBearerToken: getUserIDFromBearerToken,
	};
};

function saveAccessToken(accessToken, userID, cbFunc) {
	const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES ('${accessToken}', ${userID});`;

	pgPool.query(getUserQuery, (response) => {
		cbFunc(response.error);
	});
}



function getUserIDFromBearerToken(bearerToken, cbFunc) {

    console.log('In getUserIDFromBearerToken ');
    const getBearerTokenQuery = `SELECT * FROM access_tokens WHERE access_token = '${bearerToken}';`;

    
    pgPool.query(getBearerTokenQuery, (response) => {
        var token = response.results.rows[0];
        cbFunc(
            response,
            response.results && response.results.rowCount === 1
                ? response.results.rows[0]
                : null
        );
    });

}

