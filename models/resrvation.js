const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    debutHour: { type: Date, required: true },
    finHour:   { type: Date,required:true},
    valide: 	{type : Boolean , default : false},
    author: 	{type : mongoose.Types.ObjectId, ref:'User'}, 
    room:      {type : mongoose.Types.ObjectId, ref:'Room'}
})

const resevation = mongoose.model("reservation",reservationSchema)

module.exports={resevation}