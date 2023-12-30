const LocalStrategy = require('passport-local').Strategy
const { pool } = require("./dbConfig")
const bcrypt = require("bcrypt")

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        pool.query(`SELECT * FROM "Users" WHERE username = $1 OR email = $1`, [username], (err, results) => {
            if (err)
                throw err

            // console.log(results.rows)

            if (results.rows.length > 0) {
                const user = results.rows[0]

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err)
                        throw err

                    if (isMatch) {
                        console.log("Logged in!")
                        return done(null, user)
                    }
                    else {
                        console.log("Password is not correct")
                        return done(null, false, { message: "Password is not correct."})
                    }
                })
            }
            else {
                console.log("Email is not registered")
                return done(null, false, {message: "Email / Username is not registered"})
            }
        })
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    )

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM "Users" WHERE id = $1`, [id], (err, results) => {
            if (err)
                throw err

            return done(null, results.rows[0])
        })
    })
}

module.exports = initialize