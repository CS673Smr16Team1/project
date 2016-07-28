/**
 * Created by Chris on 7/27/2016.
 */

var assert = require('assert');
var dbFunctions = require('../../dbFunctions.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('ArchivePublicMessage', function() {
    describe('archivePublicMessage()', function () {
        it('Should update the database with the new message', function (done) {
            var data = "Testing with Mocha";
            var msgDate = new Date();
            var senderId = 12;
            var channel_id = 3;

            dbFunctions.archivePublicMessage({
                message_content: data, message_date: msgDate, sender_id: senderId, channel_id: channel_id

            });

            setTimeout(function() {
                connection.query("select message_content from ChatNowPublicMessage where message_content = ?", "Testing with Mocha", function(err, rows) {
                    assert.equal("Testing with Mocha", rows[0].message_content);
                    done();
            })}, 1500);

        });
    });
});