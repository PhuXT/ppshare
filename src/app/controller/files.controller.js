const path = require('path')
const fileModel = require('../models/files.model')
const { v4: uuidv4 } = require('uuid');
const process = require('process');
const sendEmail = require('../../service/email.Service')


require('dotenv').config

class UploadsFile {
    // [GET] /files/uploads
    showPageUpload(req, res, next) {
        res.render('uploads')
    }

    // [POST] /api/uploads/files
    
    async create(req, res, next) {
        if(!req.file) {
            return res.json({erro: 'All field are required'});
        }
        console.log(req.file);
        const file = fileModel({
            fileName: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })
        try {
            const response =  await file.save()
            console.log('File Saved Successfully');
            return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
        } catch (error) {
            return res.json({error: "Something went wrong"})
        }
    }

    // [GET]: /files/:uuid
    async responesInfoFile(req, res, next) {
        const uuid = req.params.uuid
        try {

           const file =  await fileModel.findOne({ uuid : uuid })
           if(!file) {
              return res.render('download', {error: 'Link has been expried'})
           }
           console.log('file name: ' + file.fileName);
           if(file.ttl > Date.now()) {
                let ttl = Math.round((parseInt(file.ttl) - Date.now()) / (60*60*1000))
                return res.render('download', {
                    uuid: file.uuid,
                    size: file.size,
                    fileName: file.fileName,
                    linkDowload: `${process.env.APP_BASE_URL}/files/dowload/${file.uuid}`,
                    ttl
                })
           }
           return res.render('download', {error: 'Link has been expried'})

        } catch (error) {
            return res.render('download', {error: 'Something went wrong!'})
            
        }
    }

    // [GET] /files/dowload/:uuid
    async responseDowload(req, res) {
        try {
            const file = await fileModel.findOne({uuid: req.params.uuid})
            if(file){
                if(file.ttl > Date.now()){
                const filePath = `${__dirname}/../../../${file.path}`
                return res.download(filePath, (err) =>{
                    });
                }
            // return res.render('dowload', {error: 'Link has been expried!'})
            return res.json({error: 'Link has been expried!' })


            }
            // return res.render('dowload', {error: 'Link has been expried!'})
            return res.json({error: 'Link has been expried!' })
        } catch (error) {
            
        }
    }

    // [POST] /files/send
    async sendFile(req, res) {
        const {uuid, emailTo, emailFrom} = req.body
        if(!uuid || !emailTo || !emailFrom) {
            res.status(442).send({error: 'All fields are required!'})
        }
        console.log(uuid);
        const file = await fileModel.findOne({uuid})
        console.log(file);
        if(file.sender) {
            return res.status(442).send({error: 'Email already send'})
        }
        file.sender = emailFrom
        file.receive = emailTo
        const reponseSave = await file.save()

        // send Email
        sendEmail({
            from: file.sender,
            to: file.receive,
            subject: 'PShare file sharing',
            text: `${file.sender} shared a file with you`,
            html: require('../../service/email.Templates')({
                dowloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            })
        })
        return res.send({success: true})
    }
}

module.exports = new UploadsFile()