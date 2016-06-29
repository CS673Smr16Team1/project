/**
 * Created by jackie on 6/28/16.
 */

var assert = require('assert');
var bugsCreate = require('../../routes/bugs/bugs-create.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('BugsCreate', function() {
    describe('createIssue()', function () {
        it('Should create an issue in the database', function (done) {
            req = {
                body: {
                    summary: 'Test Summary Issue 123',
                    priority: 'LOW',
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
                    if (url === '/bugs') {
                        done();
                    } else {
                        throw new Error('Error inserting issue');
                    }
                    connection.query('DELETE FROM Issues Where Summary = ?', 'Test Summary Issue 123');
                }
            };
            bugsCreate.createIssue(req, res);
        });
    });
});