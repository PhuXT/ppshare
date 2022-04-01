const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ttl = Date.now() + 24*(1000*60*60)

const fileSchema = new Schema({
    fileName: { type: String, require: true },
    path: { type: String, require: true },
    size: { type: Number, require: true},
    uuid: { type: String, require: true},
    sender: { type: String, require: false },
    receive: { type: String, require: false},
    ttl: { type: Number, default: ttl},
}, { timestamps: true })

module.exports = mongoose.model('File', fileSchema)
