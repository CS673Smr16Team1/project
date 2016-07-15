/**
 * Created by jackie on 6/28/16.
 */

var assert = require('assert');
var archiveIssue = require('../../routes/bugs/bugs-archive.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('BugsArchive', function() {
    describe('archiveIssue()', function () {
        it('Should archive an issue in the database', function (done) {
            req = {
                params: {
                    id: -1
                },
                body: {
                    summary: 'Test Archive Summary Issue 123',
                    priority: 'HIGH',
                    severity: 'LOW',
                    assignedTo: 'jak464',
                    archived: 0,
                    content: 'This is the content of the archived issue',
                },
                user: {
                    username: 'jak464'
                }
            };

            res = {
                redirect: function(url) {
                    connection.query('select * from Issues where Id = ?', -1, function(err, rows) {
                        connection.query('update Issues set Archived = 0 where Id = ?', [-1], function() {
                            if (rows && rows[0].Archived == 1) {
                                done();
                            } else {
                                throw new Error("Error archiving issue");
                            }
                        });

                    });
                }
            };
            archiveIssue(req, res);
        });
    });
});