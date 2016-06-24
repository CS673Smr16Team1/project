/**
 * Created by Chris on 6/19/2016.
 */
var nodemailer = require('nodemailer');
var credentials = require('./credentials.js');

// Chris - used nodermailer example for reference

var f1 = function(sender, recipient, message) {
    //console.log(recipient);
// create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://' + credentials.SMTPUser +'%40gmail.com:' +
        credentials.SMTPPassword + '@smtp.gmail.com');

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"μProject" <μProject@foo.com>', // sender address
        to: recipient, // list of receivers
        subject: sender + ' Sent You a Private Message', // Subject line
        text: message, // plaintext body
        html: '<p>' + message + '</p>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        //console.log('Message sent: ' + info.response);
    });
};

module.exports = {
    sendEmail: f1
};