const LocalStrategy = require('passport-local').Strategy
// const { pool } = require("./dbConfig")
// const pool = require("./database/database");
const { Sequelize } = require('sequelize');
const models = require("./models");
const bcrypt = require("bcrypt");

async function initialize(passport) {
    // const client = pool.connect();
    try {
        // const authenticateUser = (username, password, done) => {
        //     client
        //         .query(`SELECT * FROM "Users" WHERE username = $1 OR email = $1`, [username])
        //         .then((results) => {
        //             if (results.rows.length > 0) {
        //                 const user = results.rows[0]
    
        //                 bcrypt.compare(password, user.password, (err, isMatch) => {
        //                     if (err)
        //                         throw err
    
        //                     if (isMatch) {
        //                         console.log("Logged in!")
        //                         return done(null, user)
        //                     }
        //                     else {
        //                         console.log("Password is not correct")
        //                         return done(null, false, { message: "Password is not correct."})
        //                     }
        //                 });
        //             }
        //             else {
        //                 console.log("Email is not registered")
        //                 return done(null, false, {message: "Email / Username is not registered"})
        //             }
        //         })
        //         .catch((err) => {
        //             throw err;
        //         });
        // }

        // passport.use(
        //     new LocalStrategy(
        //         {
        //             usernameField: "email",
        //             passwordField: "password"
        //         },
        //         authenticateUser
        //     )
        // )

        // passport.serializeUser((user, done) => done(null, user.id))

        // passport.deserializeUser((id, done) => {
        //     client
        //         .query(`SELECT * FROM "Users" WHERE id = $1`, [id])
        //         .then((results) => {
        //             return done(null, results.rows[0])
        //         })
        //         .catch((err) => {
        //             throw err;
        //         });
        // })
        const authenticateUser = async (username, password, done) => {
            try {
                const user = await models.User.findOne({
                    where: Sequelize.or({ username: username }, { email: username }),
                });
        
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
        
                    if (isMatch) {
                        console.log('Logged in!');
                        return done(null, user);
                    } else {
                        console.log('Password is not correct');
                        return done(null, false, { message: 'Password is not correct.' });
                    }
                } else {
                    console.log('Email is not registered');
                    return done(null, false, { message: 'Email / Username is not registered' });
                }
            } catch (error) {
                console.error(error);
                return done(error);
            }
        };
        
        passport.use(
            new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            authenticateUser
            )
        );
    
        passport.serializeUser((user, done) => done(null, user.id));
    
        passport.deserializeUser(async (id, done) => {
            try {
            const user = await models.User.findByPk(id);
            return done(null, user);
            } catch (error) {
            console.error(error);
            return done(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = initialize