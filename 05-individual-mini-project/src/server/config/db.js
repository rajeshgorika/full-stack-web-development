const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_project_db';
        const conn = await mongoose.connect(uri);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`[Database Error] ${err.message}`);
        // Do not crash server on local dev if mongodb is offline
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
