/**
 *
 * Queued Test: updateStory.js
 *
 * This script tests updateStory.js
 *
 * Created by Sang-Joon Lee on 7/7/16.
 *
 */
var expect  = require("chai").expect;
var request = require("request");
var assert = require('assert');

var saveStory = require('../../routes/queued/saveStory.js');
var updateStory = require('../../routes/queued/updateStory.js');

var connection = require('../../routes/dbConnection.js').dbConnect();

describe('Queued - Create and View Story', function() {

    describe('saveStory()', function () {
        it('Should insert a story in the database', function (done) {

            var testProjectId = 3;
            var testTitle = 'queuedTest008 updating requirement';
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
                        if (rows) {
                            expect(rows[0].title).to.equal(testTitle);

                            done();
                        } else {
                            throw new Error("Error inserting story");
                        }
                        // check the title using expect call
                    });
                }
            };

            // call javascript
            saveStory(req, res);

        });
    });

    describe('updateStory()', function () {
        it('Should update a story from database', function (done) {

            var testStoryId;
            var testProjectId = 3;
            var testTitle = 'queuedTest008 updating requirement';
            var testDesc = 'Updated Description';


            // Query database table QueuedStory for this specific title
            connection.query('select * from QueuedStory where title= ?', testTitle, function(err, rows) {
                // check the title using expect call

                testStoryId = rows[0].storyId;
                console.log (testStoryId);

                req = {
                    params: {
                        projectId: testProjectId,
                        storyId:testStoryId
                    },

                    body: {
                        title: testTitle,
                        content: testDesc,
                        duedate: '2016-07-22',
                        story_status: 'Current',
                        assignedTo: 'sangDev',
                        type:     'Bug',
                        priority: 'Low'
                    },
                    user: {
                        username: 'sangDev'
                    }
                };

                res = {
                    redirect: function (url) {
                        // Query database table QueuedStory for this specific title
                        connection.query('select * from QueuedStory where title= ?', testTitle, function (err, rows) {
                            // delete test entry from database
                            connection.query('delete from QueuedStory where title = ?', testTitle, function() {
                                if (rows) {
                                    expect(rows[0].storyId).to.equal(testStoryId);
                                    expect(rows[0].description).to.equal(testDesc);
                                    expect(rows[0].story_status).to.equal('Current');
                                    expect(rows[0].type).to.equal('Bug');

                                    done();
                                } else {
                                    throw new Error("Error deleting story");
                                }
                            });

                        });
                    }
                };
                // call javascript
                updateStory(req, res);
            });
        });
    });
});
