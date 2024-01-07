const controller = {};
const models = require("../../models");
const pool = require("../../database/database");
const bcrypt = require("bcrypt");

controller.show = async (req, res) => {
  res.locals.users = await models.User.findAll({
    attributes: [
      "id",
      "imagePath",
      "fullName",
      "username",
      "isWard",
      "isDistrict",
      "isDepartment",
      "wardUnit",
      "districtUnit"
    ],
    order: [["createdAt", "DESC"]],
  });

  let client = await pool.connect();
  try {
    const result = await client.query(`SELECT DISTINCT "districtName" FROM "Wards"`);
    res.locals.districts = result.rows;
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
    // client.end();
  }

  res.render("PHCB-So/manage-account", {layout: "PHCB-So/layout"});
};

controller.addUser = async (req, res) => {
  let {username, fullName, chucVu, wardUnit, districtUnit, password} = req.body;

  let hashedPassword = await bcrypt.hash(password, 10);

  const isExisted = await models.User.findOne({ where: {username} });
  if (isExisted) {
    return res.json({ error: true, message: 'Tên đăng nhập đã tồn tại!' });
  }
  if (!isExisted) {
    try {
      await models.User.create({
        username,
        password: hashedPassword,
        fullName,
        isWard: chucVu=="Cán bộ phường" ? true : false,
        isDistrict: chucVu=="Cán bộ quận" ? true : false,
        isDepartment: false,
        wardUnit,
        districtUnit
      });
      res.redirect("/PHCB-So/tai-khoan");
    } catch (error) {
      res.send("Can't add user");
      console.error(error);
    }
  }
}

controller.deleteUser = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  try {
    await models.User.destroy(
      {where: {id}}
    );
    res.send("User deleted!");
  } catch (error) {
    res.send("Can't delete user!");
    console.error(error);
  }
}

controller.checkUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await models.User.findOne({ where: { username } });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

controller.checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await models.User.findOne({ where: { email } });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

controller.wardsByDistrict = async (req, res) => {
  const { district } = req.query;
  try {
    const ward = await models.Ward.findAll({ 
      where: { districtName: district } 
    });

    res.json(ward);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
