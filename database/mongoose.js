"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongooseCache;
if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}
const connectToDatabase = async () => {
    if (!MONGODB_URI)
        throw new Error("MONGODB_URI must be set within .env");
    if (cached.conn)
        return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose_1.default.connect(MONGODB_URI, { bufferCommands: false });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (err) {
        cached.promise = null;
        throw err;
    }
    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);
    return cached.conn;
};
exports.connectToDatabase = connectToDatabase;
