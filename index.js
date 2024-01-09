const express = require('express');
const app = new express();
const port = 4000 || process.env.PORT;
const expressHbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser');
const { pool } = require("./database/database");
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
require('dotenv').config();

Handlebars.registerHelper('if_eq', function (a, b, options) {
    if (a == b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
// quan
Handlebars.registerHelper('getUniqueValues', function (array, property, options) {
    const uniqueValues = [...new Set(array.map(item => item[property]))];
    return uniqueValues.map(value => options.fn(value));
  });
// quan
Handlebars.registerHelper('unlessCond', function (v1, v2, options) {
    if (v1 !== v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

const initializePassport = require('./passportConfig')

initializePassport(passport)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/html"))

app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'auth',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }, 
    helpers: {
        showDate: (date) => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        showIndex: (index) => index + 1,
    }
}));

app.set("view engine", "hbs")

// Cau hinh de doc du lieu gui len theo phuong thuc POST
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https 
            maxAge: 10 * 60 * 1000, // 10 minutes
        }
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// app.get('/', function(req, res) {
//     res.render("login")
// })

app.use("/", require("./routes/authRouter"));

// PHCB SoVHTT
app.get('/PHCB-So', (req, res) => res.redirect('/PHCB-So/danh-sach'));
app.use('/PHCB-So/danh-sach', require('./routes/PHCB-So/wardRouter'));
app.use('/PHCB-So/tai-khoan', require('./routes/PHCB-So/userRouter'));
app.use('/PHCB-So/yeu-cau', require('./routes/PHCB-So/requestRouter'));
app.use('/PHCB-So/thong-ke', require('./routes/PHCB-So/statisticRouter'));
app.use('/PHCB-So/profile', require('./routes/PHCB-So/profileRouter'));
app.use('/PHCB-So/change-password', require('./routes/PHCB-So/passwordRouter'));

// app.post("/auth", passport.authenticate("local", {
//     successRedirect: "/auth",
//     failureRedirect: "/",
//     failureFlash: true
// }))

// PHCB Quan
app.get('/PHCB-Quan', (req, res) => res.redirect('/PHCB-Quan/homepage'));
app.use('/PHCB-Quan/danh-sach', require('./routes/PHCB-Quan/manageListRouter'));
app.use('/PHCB-Quan/yeu-cau', require('./routes/PHCB-Quan/requestRouter'));
app.use('/PHCB-Quan/bao-cao', require('./routes/PHCB-Quan/reportRouter'));
app.use('/PHCB-Quan/diem-dat-bang-quang-cao', require('./routes/PHCB-Quan/adsAddressRouter'));
app.use('/PHCB-Quan/bang-quang-cao', require('./routes/PHCB-Quan/adsManageRouter'));
app.use('/PHCB-Quan/homepage', require('./routes/PHCB-Quan/showmapRouter'));
app.use('/PHCB-Quan/profile',require('./routes/PHCB-Quan/profileRouter'));
app.use('/PHCB-Quan/change-password',require('./routes/PHCB-Quan/changePasswordRouter'));

// PHCB Phuong
app.get('/PHCB-Phuong', (req, res) => res.redirect('/PHCB-Phuong/homepage'));
app.use('/PHCB-Phuong/homepage',require('./routes/PHCB-Phuong/homepageRouter'));
app.use('/PHCB-Phuong/manageList',require('./routes/PHCB-Phuong/manageListRouter'));
app.use('/PHCB-Phuong/reports',require('./routes/PHCB-Phuong/reportsRouter'));
app.use('/PHCB-Phuong/requests',require('./routes/PHCB-Phuong/requestsRouter'));
app.use('/PHCB-Phuong/profile',require('./routes/PHCB-Phuong/profileRouter'));
app.use('/PHCB-Phuong/changePassword',require('./routes/PHCB-Phuong/changePasswordRouter'));

app.listen(port, function(err) {
    if (typeof(err) == "undefined") {
        console.log("Your application is running on port: " + port)
    }
})