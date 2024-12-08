const express = require('express');
const cors = require('cors');
const supertokens = require('supertokens-node');
const { middleware, errorHandler } = require('supertokens-node/framework/express');
const Passwordless = require('supertokens-node/recipe/passwordless');
// Add this line to import Session
const Session = require('supertokens-node/recipe/session');
const { appInfo } = require('./appInfo');

// Initialize SuperTokens
supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.com"
  },
  appInfo,
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL",
      flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
      createAndSendCustomEmail: async (input) => {
        console.log("Login URL:", input.urlWithLinkCode);
      },
    }),
    // Now Session should be defined
    Session.init()
  ],
});

const app = express();
app.use(cors({
  origin: "http://3.131.82.143:3000", // or your domain
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}));

app.use(middleware());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(errorHandler());

app.listen(3001, '0.0.0.0', () => {
  console.log("Server running on http://localhost:3001");
});
