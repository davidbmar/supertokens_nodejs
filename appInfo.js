// appInfo.js
const dotenv = require('dotenv');
dotenv.config();

const appInfo = {
    appName: "Supertokens Passwordless Demo",
    apiDomain: "http://3.131.82.143:3001",  // Update if your server domain/IP is different
    websiteDomain: "http://3.131.82.143:3000",  // Update if your frontend domain/IP is different
    apiBasePath: "/auth",
    websiteBasePath: "/",
};

module.exports = { appInfo };
