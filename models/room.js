const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName:{type:String},
    capacity:{type:Number},
    equipment:[{type:String}],
    imageUrl:[{type: String}]
    
}) 
const Room = mongoose.model('Room',roomSchema)
module.exports = Room;