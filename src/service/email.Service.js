const nodemailer = require('nodemailer')

function senEmail({from, to, subject, text, html}){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        // secureConnection: false,
        secure: true,
        auth: {
            user: 'phamphu0404@gmail.com', 
            pass: 'sdznxhnqwakavkgo' 
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from,
        to,
        subject,
        text,
        html
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log('Erro Send Mail: '+err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
}
module.exports = senEmail
