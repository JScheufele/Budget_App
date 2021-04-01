module.exports = {
    query: query,
};

const Pool = require("pg").Pool;

function query(queryString, cbFunc) {
	const pool = new Pool({
		user: "postgres",
		host: "localhost",
		database: "budget_db",
		password: "Paul6515",
		port: 5432,
	});

	pool.query(queryString, (error, results) => {
		cbFunc(setResponse(error, results));

        pool.end();

	});

}

function setResponse(error, results) {
	return {
		error: error,
		results: results ? results : null,
	};
}

