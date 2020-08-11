"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
const cors_1 = __importDefault(require("cors"));
const firebase_1 = require("./firebase");
const checkout_1 = require("./checkout");
const payments_1 = require("./payments");
const customers_1 = require("./customers");
const billing_1 = require("./billing");
// ALLOW CROSS URL'S TO ACCESS
exports.app.use(express_1.default.json());
exports.app.use(cors_1.default({ origin: true }));
exports.app.post('/test', (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 2 }); //
});
// RAWBODY FOR WEBHOOK HANDLING
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
// CHECKOUT
exports.app.post('/checkouts/', runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
// CATCH ERRORS
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
// PAYMENT INTENTS
exports.app.post('/payments', runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
// CUSTOMERS & SETUP INTENTS
// SAVE CARD ON CUSTOMER RECORD WITH SETUPINTENT
exports.app.post('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const setupIntent = await customers_1.createSetupIntent(user.uid);
    res.send(setupIntent);
}));
// RETRIEVE ALL CUSTOMER CARDS
exports.app.get('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const wallet = await customers_1.listPaymentMethods(user.uid);
    res.send(wallet.data);
}));
// DECODE FIREBASE TOKEN
exports.app.use(decodeJWT);
// DECODE TOKEN & MAKE DATA AVAILABLE IN BODY
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
// ERROR IF USER DOES NOT EXIST
function validateUser(req) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error('You must be logged in to make this request. i.e Authroization: Bearer <token>');
    }
    return user;
}
// CUSTOMER & SETUP INTENTS
// SAVE CARD FOR CUSTOMER INTENT
exports.app.post('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const setupIntent = await customers_1.createSetupIntent(user.uid);
    res.send(setupIntent);
}));
// GET ALL CARDS FOR CUSTOMER
exports.app.get('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const wallet = await customers_1.listPaymentMethods(user.uid);
    res.send(wallet.data);
}));
// BILLING & RECURRING SUBSCRIPTIONS
// CREATE & CHARGE A NEW SUBSCRIPTION
exports.app.post('/subscriptions/', runAsync(async (req, res) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await billing_1.createSubscription(user.uid, plan, payment_method);
    res.send(subscription);
}));
//# sourceMappingURL=api.js.map