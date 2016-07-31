/**
 *
 * File Name: deleteStory.js
 *
 * This script deletes a story.
 *
 * Created by sangjoonlee on 2016-06-11.
 */

var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function deleteStory(req , res , next){

        var storyId = req.params.storyId;
        var projectId = req.params.projectId;


        // #debug: printing projectId of the currently requested view
        //console.log("storyId: %s",storyId);


        connection.query("DELETE FROM QueuedStory WHERE storyId=?",
            storyId,
            function(err) {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/queued/project/' + projectId);
            }
        );

    };