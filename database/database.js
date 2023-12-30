const Pool = require('pg').Pool

// Create the connection pool
const pool = new Pool({
    user: "yoaqtxvl",
    host: "rain.db.elephantsql.com",
    database: "yoaqtxvl",
    password: "PPr7gzt67BbTzFagQlqq_MzwzfpzX2Hr",
    port: 5432
});

module.exports = pool;