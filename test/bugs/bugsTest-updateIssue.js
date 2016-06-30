/**
 * Created by jackie on 6/28/16.
 */

var assert = require('assert');
var saveIssue = require('../../routes/bugs/bugs-save.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('BugsSave', function() {
    describe('saveIssue()', function () {
        it('Should update an issue in the database', function (done) {
            req = {
                params: {
                    id: -1
                },
                body: {
                    summary: 'Test Update Summary Issue 123',
                    priority: 'HIGH',
                    severity: 'LOW',
                    assignedTo: 'jak464',
                    content: 'This is the content of the issue',
                },
                user: {
                    username: 'jak464'
                }
            };
            
            res = {
                redirect: function(url) {
                    connection.query('select * from Issues where Id = ?', -1, function(err, rows) {
                        connection.query('update Issues set Priority = ? where Id = ?', ['LOW', -1], function() {
                            if (rows && rows[0].Priority == 'HIGH') {
                                done();
                            } else {
                                throw new Error("Error updating summary");
                            }
                        });

                    });
                }
            };
            saveIssue(req, res);
        });
    });
});