const Room = require('../models/room')

const addRooms = async (req, res) => {
try {
    const {roomName,capacity,equipment , imageUrl} = req.body;
    //req.userId hedhy ely 7adharha l middleware
    const room = new Room({roomName,capacity,equipment,imageUrl})
    await room.save();
    res.status(201).send('Room created successfuly')
  } catch(error){
      res.status(400).send(error.message)

  }
}


const allRooms = async (req, res) => {
try {
    const rooms = await Room.find()
    res.send(rooms)
} catch (error){
    res.status(500).send('server error')
}
}

const getRoomById = async (req,res) => {
    try {
        const { _id } = req.params;
        console.log(req.params)
        const room = await Room.findById(_id);
        if (!room) {
            return res.status(404).send('Room not found.');
          }
          res.status(200).send(room);
    } catch (error) {
        console.error(error); 
        res.status(500).send('Server error.');
    }
}

module.exports = {allRooms,addRooms,getRoomById}