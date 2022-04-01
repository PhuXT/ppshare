const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
    async connect(){
        try {
            await mongoose.connect(process.env.MONGO_CONNECTION_URL)
            console.log('DATABASE CONNECTED');
        } catch (error) {
            console.log('CONNECT FAILED');
        }
    }
}
