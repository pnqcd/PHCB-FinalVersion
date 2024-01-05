const controller = {};
// const models = require("../../models");
const pool = require("../../database/database");
const cheerio = require('cheerio');

controller.show = async (req, res) => {
    const client = await pool.connect();

    try {
        let result = await client.query(`SELECT DISTINCT "districtName" FROM "Wards"`);
        res.locals.districts = result.rows;
        
        let locationCount = await client.query(`SELECT COUNT(locationreport) FROM reports WHERE locationreport=true`);
        res.locals.locationReports = locationCount.rows[0].count;

        let adsCount = await client.query(`SELECT COUNT(locationreport) FROM reports WHERE locationreport=false`);
        res.locals.adsReports = adsCount.rows[0].count;

        let reportResult = await client.query(`SELECT * FROM reports`);
        let reports = reportResult.rows;
        reports.forEach(report => {
            const htmlString = report.reportcontent;
            const $ = cheerio.load(htmlString);
            const paragraphContent = $('p').text();
            
            report.reportcontent = paragraphContent;
        });
        res.locals.reports = reports;

        res.render("PHCB-So/statistic", {layout: "PHCB-So/layout"});
    } catch (err) {
        console.error("Error retrieving data: ", err);
    } 
    finally {
        await client.release();
        // Close the database connection 
        // await client.end();
    }
};

controller.getAllReports = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query(`SELECT * FROM reports`);
        res.json(results.rows);
    } catch (error) {
        res.status(500).json({ error });
        console.error(error);
    } 
    finally {
        await client.release();
        // await client.end();
    }
}

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        if (req.user.isDepartment)
            next();
        else res.redirect('/');
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller;
