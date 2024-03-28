const Reservation = require("../models/resrvation.js")
const getByRoom = async(req,res)=>{
    try{
        const {RoomId}=req.params.RoomId
        const reservation = Reservation.find({room:RoomId})
        console.log("🚀 ~ getByRoom ~ reservation:", reservation)
        res.send(reservation).status(200)
    }
catch(error){
    console.log(error);
    res.send(error).status(400)
}
}

const getByUser=async (req,res)=>{
    try{
        const {UserId}=req.params.UserId
        const reservation = Reservation.find({author:UserId})
        console.log("🚀 ~ getByUser ~ reservation:", reservation)
        res.send(reservation).status(200)
    }
catch(error){
    console.log(error);
    res.send(error).status(400)
}
}

const postReservation =async(req,res)=>{
 try{
    const reservation = req.body
    const valid =await check(reservation.room,reservation.debutHour,reservation.finHour);
    if(valid===false){
        res.send("Resevation date ovelapping with an existing one please change it.").status(422)
    }
    const newReservation= await Reservation.create(reservation).save()
    res.send(newReservation).status(201)
}catch(error){
    console.log(error);
    res.send(error).status(400)
}}

const check = async (room, dateStart, dateEnd) => {
    try {
        const existingReservations = await Reservation.find({
            room: room,
            $or: [
                { debutHour: { $lt: dateEnd }, finHour: { $gt: dateStart } }, 
                { debutHour: { $gte: dateStart, $lte: dateEnd } }, 
                { finHour: { $gte: dateStart, $lte: dateEnd } } 
            ]
        });
        if (existingReservations.length > 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while checking reservations.');
    }
};