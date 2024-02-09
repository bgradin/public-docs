const fs = require('fs');

require("dotenv").config();

fs.cpSync("./identity", "./files/docs", { recursive: true });
