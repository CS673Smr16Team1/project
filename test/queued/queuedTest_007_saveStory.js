/**
 *
 * Queued Test: saveStory.js
 *
 * This script tests saveStory.js
 *
 * Created by Sang-Joon Lee on 7/7/16.
 *
 */
var expect  = require("chai").expect;
var request = require("request");
var assert = require('assert');

var saveStory = require('../../routes/queued/saveStory.js');
var connection = require('../../routes/dbConnection.js').dbConnect();

describe('Queued Create Story', function() {
    describe('saveStory()', function () {
        it('Should create a story in the database', function (done) {

            var testProjectId = 3;
            var testTitle = 'queuedTest007 inserting a new requirement';
            var testDesc = 'this is automated test input';

            req = {
                params: {
                    projectId: testProjectId
                },

                body: {
                        title: testTitle,
                        content: testDesc,
                        duedate: '2016-07-21',
                        story_status: 'Backlog',
                        assignedTo: 'sangDev',
                        type:     'Feature',
                        priority: 'Low'
                },
                user: {
                    username: 'sangDev'
                }
            };

            res = {
                redirect: function(url) {

                    // Query database table QueuedStory for this specific title
                    connection.query('select * from QueuedStory where title= ?', testTitle, function(err, rows) {

                        // check the title using expect call
                        expect(rows[0].title).to.equal(testTitle);

                        // delete test entry from database
                        connection.query('delete from QueuedStory where title = ?', testTitle, function() {
                            if (rows) {
                                done();
                            } else {
                                throw new Error("Error inserting story");
                            }
                        });

                    });
                }
            };

            // call javascript
            saveStory(req, res);


        });
    });
});