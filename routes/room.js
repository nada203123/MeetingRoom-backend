const express = require('express')
const router = express.Router();

const { allRooms,addRooms,getRoomById }= require('../controller/room')

router.get('/allrooms',allRooms)
router.post('/addRoom', addRooms)
router.get('/roomById/:_id',getRoomById)
module.exports = router ; 