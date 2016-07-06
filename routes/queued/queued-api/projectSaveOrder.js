/**
 * Created by Sang-Joon Lee on 7/6/16.
 */
var connection = require('../../dbConnection.js').dbConnect();

module.exports =
    function projectSaveOrder(req, res){

        console.log("Project Story Order: testing save")
        console.log("Project Story Order: %s", req.params.data)
        var dataString = req.params.data;
        var story_status = req.params.storyStatus;

        var storyIDs = dataString.split(",").map(Number);

        // print first element in the ordered list
        console.log(storyIDs[0]);

        var i;

        for (i = 0; i < storyIDs.length; i++) {

            //UPDATE  673projectdev.QueuedStory set priorityId = 111 WHERE storyId = 5;
            connection.query("UPDATE QueuedStory set priorityId=?, story_status = ? WHERE storyId=?",
                [i+1, story_status, storyIDs[i]],       // passing inputForm and storyId
                function (err) {
                    if (err)
                        console.log("Error inserting Story: %s ", err);
                });
        };
    };
