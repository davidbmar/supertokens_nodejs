const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const supertokens = require('supertokens-node');
const { middleware, errorHandler } = require('supertokens-node/framework/express');
const Passwordless = require('supertokens-node/recipe/passwordless');
const Session = require('supertokens-node/recipe/session');
const { appInfo } = require('./appInfo');

// Initialize SuperTokens with explicit session configuration
supertokens.init({
    framework: "express",
    supertokens: {
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "http://localhost:3567",
        apiKey: process.env.SUPERTOKENS_API_KEY
    },
    appInfo,
    recipeList: [
        Passwordless.init({
            contactMethod: "EMAIL",
            flowType: "MAGIC_LINK",
            emailDelivery: {
                override: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        sendEmail: async (input) => {
                            console.log("\n🔗 MAGIC LOGIN LINK (valid for 15 minutes):");
                            console.log(input.urlWithLinkCode);
                            console.log("\nEmail:", input.email);
                            return originalImplementation.sendEmail(input);
                        }
                    };
                }
            }
        }),
        Session.init({
            // Explicitly set session duration
            expiration: 24 * 60 * 60, // 24 hours in seconds
            cookieSecure: false, // Set to true in production with HTTPS
            cookieSameSite: "lax"
        })
    ],
});

const app = express();

// CORS configuration with credentials
app.use(cors({
    origin: "http://3.131.82.143:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(middleware());

// Session check endpoint
app.get('/api/session/check', async (req, res) => {
    let session;
    try {
        session = await Session.getSession(req, res, {
            sessionRequired: false
        });
        res.json({
            isLoggedIn: session !== undefined,
            userId: session?.getUserId()
        });
    } catch (err) {
        res.json({
            isLoggedIn: false,
            error: err.message
        });
    }
});

app.use(errorHandler());

app.listen(3001, '0.0.0.0', () => {
    console.log("Server running on http://localhost:3001");
});
