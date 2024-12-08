const express = require('express');
const cors = require('cors');
const supertokens = require('supertokens-node');
const { middleware, errorHandler } = require('supertokens-node/framework/express');
const Passwordless = require('supertokens-node/recipe/passwordless');
const { appInfo } = require('./appInfo');

// Initialize SuperTokens
supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.com", // For testing; switch to your own core later if needed
  },
  appInfo,
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL",
      flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
      createAndSendCustomEmail: async (input, context) => {
        // Here you would configure how emails are sent.
        // For a prototype, you can just log the URL.
        console.log("Login URL:", input.urlWithLinkCode);
      },
    }),
    Session.init() // Add this line
  ],
});

// Setup Express
const app = express();
app.use(cors({
  origin: "http://3.131.82.143:3000",
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}));

app.use(middleware());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(errorHandler());

// Start server
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
