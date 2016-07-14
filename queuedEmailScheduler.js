/**
 * Created by jackie on 7/5/2016.

 This will be run daily at 3:30PM daily and
    1. get list of requirements that are due tomorrow.
    2. loop through requirements list and create object where assignee is key and requirements is value
    3. get assignee email and send list of requirements to them (if queued_email_notification = true)
 */

var nodemailer = require('nodemailer');
var credentials = require('./credentials.js');
var cron = require('node-schedule');
var dbFunctions = require('./dbFunctions.js');
var connection = require('./routes/dbConnection.js').dbConnect();
var encryption = require('./encryption.js');


/* This runs at 3:30PM Daily. */
var rule = new cron.RecurrenceRule();
rule.dayOfWeek = [1,2,3,4,5,6,0];
rule.hour = 15;
rule.minute = 30;
cron.scheduleJob(rule, sendQueuedEmail);

function sendQueuedEmail() {
    var tomorrowsDate = new Date();
    tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);

    var doneStatus = 'Done';
    var releaseStatus = 'Release';

    connection.query("SELECT storyId, title, story_status, email FROM QueuedStory " +
        "JOIN users on users.username = QueuedStory.assignee " +
        "WHERE due_date = DATE(?) AND queued_email_notification = 1 AND story_status != ? AND story_status != ?",
        [tomorrowsDate, doneStatus, releaseStatus],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);

            var emailRequirementsMap = {};
            for (var i = 0; i < rows.length; i++) {
                // if you have seen an email, push row to array
                if (emailRequirementsMap[rows[i].email]) {
                    emailRequirementsMap[rows[i].email].push(rows[i]);
                // make new array with the row
                } else {
                    emailRequirementsMap[rows[i].email] = [rows[i]];
                }
            }
            // loop through requirements
            for (var email in emailRequirementsMap) {
                if (!emailRequirementsMap.hasOwnProperty(email)) continue;

                // these are the list of requirements for that particular email
                var requirements = emailRequirementsMap[email];

                var decryptedEmail = encryption.decrypt(email);
                sendDueDateEmail(decryptedEmail, requirements);
            }

        });
};

function sendDueDateEmail(recipient, message) {
    // console.log(recipient);
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://' + credentials.SMTPUser +'%40gmail.com:' +
        credentials.SMTPPassword + '@smtp.gmail.com');

    var textMessage = 'You Have ' + message.length + ' Requirement(s) Due Tomorrow \n\n';
    for (var i = 0; i < message.length; i++) {
        textMessage += message[i].storyId + ', ' + message[i].title + ', ' + message[i].story_status + '\n';
    }

    var htmlTextMessage = "<h2>You have " + message.length + " Requirement(s) with an Upcoming Due Date! Better get working!</h2> <table>"
    for (var i = 0; i < message.length; i++) {

        if(i == 0) {
            htmlTextMessage += '<tr> <td><h3>Id</h3></td> <td><h3>Story</h3></td> <td><h3>Status</h3></td>'
        }
        htmlTextMessage += '<tr>'
        htmlTextMessage += '<td>' + message[i].storyId + '</td> <td>' + message[i].title + '</td> <td>' + message[i].story_status + '</td>';
        htmlTextMessage += '</tr>'
    }

    htmlTextMessage += "</table> <br> <br> ";
    htmlTextMessage += '<a href="uproject.thirdelement.com/queued">Go to uProject</a>';


    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"μProject" <μProject@foo.com>', // sender address
        to: recipient, // list of receivers
        subject: ' Requirements Assigned To You - Upcoming Due Date', // Subject line
        text: textMessage, // plaintext body
        html: htmlTextMessage
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        //console.log('Message sent: ' + info.response);
    });
};
