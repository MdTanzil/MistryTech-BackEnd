const corsSetting = require("./cors");
const dbConnect = require("./dbconnect");
const fileUpload = require("./multer");

module.exports = { dbConnect, corsSetting, fileUpload };
