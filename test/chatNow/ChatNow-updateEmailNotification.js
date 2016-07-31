/**
 * Created by Chris on 7/27/2016.
 */

var assert = require('assert');
var updateEmailNotification = require('../../routes/chat/chat-api/update-email-notification.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('UpdateEmailNotification', function() {
    describe('updateEmailNotification()', function () {
        it('Should update the ChatNow email notification of the user in the database', function (done) {
            req = {
                params: {
                    setting: 1
                },
                user: {
                    username: 'chriscarducci'
                }
            };

            updateEmailNotification(req, function() {

            });

            setTimeout(function() {
                connection.query('SELECT email_notification FROM users WHERE username = ?', 'chriscarducci', function(err, rows) {
                    assert.equal(1, rows[0].email_notification);
                    done();
                })}, 1500);
        });
    });
});