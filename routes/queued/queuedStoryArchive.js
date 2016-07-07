/**
 * Created by Sang-Joon Lee on 7/7/16.
 */

var connection = require('./../dbConnection.js').dbConnect();


module.exports =
    function archiveStory(req , res , next){

        var storyId = req.params.storyId;
        var projectId = req.params.projectId;
        var inputFromForm = {
            archived    :   1
        };
        console.log(inputFromForm);

        // Example:
        //UPDATE 673projectdev.QueuedStory set archived=1 WHERE storyId=5

        console.log("Archive Story: %s ", storyId);

        connection.query("UPDATE QueuedStory set ? WHERE storyId=?",
            [inputFromForm, storyId],
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting : %s ",err );
            });

            res.redirect('/queued/project/'+ projectId);

    };