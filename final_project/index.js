/**
 * @param book Review App.
 * @author PAUL JH GOWASEB <SourceCodeMagnus119>
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use("/customer",session({ secret:"fingerprint_customer",
    resave: true, saveUninitialized: true
}));
app.use("/customer/auth/*", async function auth(req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res
        .status(403)
        .json({ message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "fingerprint_customer");
        req.user = decoded.username; // Save the username in the request
        next();
    } catch (err) {
        return res
        .status(401)
        .json({ message: "Invalid or expired token" });
    };
});
 

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT =5000;
app.listen(PORT,() => {
    console.log(
        "Server is running"
    );
});