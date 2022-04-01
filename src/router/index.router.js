const filesRouter = require('./files.router')

function router (app) {
    app.use('/files', filesRouter)
}
module.exports = router
