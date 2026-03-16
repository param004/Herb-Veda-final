const serverless = require('serverless-http');
const app = require('../server');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Standard fix for Mongoose + Serverless (prevents function hang)
    context.callbackWaitsForEmptyEventLoop = false;
    return await handler(event, context);
};
