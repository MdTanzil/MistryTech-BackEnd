const allowedOrigins = ["http://localhost:5173", "https://mistrytech.com.bd"];

const corsSetting = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsSetting;
