"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyMiddleware = rawBodyMiddleware;
const express = require("express");
function rawBodyMiddleware(req, res, next) {
    if (req.originalUrl === '/payments/webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    }
    else {
        express.json()(req, res, next);
    }
}
//# sourceMappingURL=raw-body.middleware.js.map