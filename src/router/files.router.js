const express = require('express')
const route = express.Router()
const multerConfig = require('../app/middleware/multerConfig')

const filesController = require('../app/controller/files.controller') 

route.get('/uploads', filesController.showPageUpload)
route.post('/uploads', multerConfig.single('myfile') , filesController.create)
route.post('/sends', filesController.sendFile)
route.get('/dowload/:uuid', filesController.responseDowload)
route.get('/:uuid', filesController.responesInfoFile)
module.exports = route
