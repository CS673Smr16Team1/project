/**
 *
 *  File: projectSaveOrder.js
 *
 *  This script saves the order of Story list with specific Story Status that was updated.
 *
 * Created by Sang-Joon Lee on 7/6/16.
 */
var connection = require('../../dbConnection.js').dbConnect();

module.exports =
    function projectSaveOrder(req, res){

        // #DEBUG
        //console.log("Project Story Order: testing save")
        //console.log("Project Story Order: %s", req.params.data)
        var dataString = req.params.data;
        var story_status = req.params.storyStatus;

        // Grab StoryID
        var storyIDs = dataString.split(",").map(Number);

        // #DEBUG: print first element in the ordered list
        //console.log(storyIDs[0]);

        var i;

        for (i = 0; i < storyIDs.length; i++) {

            // Update Database with new list
            // UPDATE  673projectdev.QueuedStory set priorityId = 111 WHERE storyId = 5;
            connection.query("UPDATE QueuedStory set priorityId=?, story_status = ? WHERE storyId=?",
                [i+1, story_status, storyIDs[i]],       // passing inputForm and storyId
                function (err) {
                    if (err)
                        console.log("Error inserting Story: %s ", err);
                });
        };
    };
