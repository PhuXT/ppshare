const mongoose = require('mongoose')
require('dotenv').config()

// module.exports = {
//     async connect(){
//         try {
//             await mongoose.connect(process.env.MONGO_CONNECTION_URL)
//             console.log('DATABASE CONNECTED');
//         } catch (error) {
//             console.log('CONNECT FAILED');
//         }
//     }
// }

module.exports = {
    connect() {
        mongoose.connect(process.env.MONGO_CONNECTION_URL)

        const connection = mongoose.connection
        connection.once('open', () => {
            console.log('DATABASE connected');
        }).on('error', err => {
            console.log('Connection failed');
        })
    }
}
