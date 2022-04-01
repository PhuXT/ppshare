const nodemailer = require('nodemailer')

function senEmail({from, to, subject, text, html}){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'phamphuw01@gmail.com', 
            pass: 'Phamvanphu01051975' 
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
            res.redirect('/');
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
}
module.exports = senEmail
