const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const summarySchema = new Schema({
    url:{type: String, required: true},
    sentences:{type: Object , required: true},
    creator :{type: mongoose.Types.ObjectId, required: true, ref:'User'},
})

module.exports = mongoose.model('Summary', summarySchema);