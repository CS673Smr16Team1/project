/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function updateStory(req , res , next){

        var projectId = req.params.projectId;
        var storyId = req.params.storyId;
        var date = new Date(req.body.duedate);
        var properlyFormatted = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2);
        console.log ("testing update story...%s ", date);
        console.log ("testing update story...%s ", date.getUTCDate());
        console.log ("testing update story...%s ", properlyFormatted);

        // get input data from form
        var inputFromForm = {
            projectId: parseInt(projectId),
            title: req.body.title,
            description: req.body.content,
            story_status: req.body.story_status,
            assignee: req.body.assignedTo,   // need to update to user name of member projects
            type: req.body.type,
            priority: req.body.priority,
            due_date: properlyFormatted

        };

        // # debug print outs
        console.log ("testing update story...");

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query("UPDATE QueuedStory set ? WHERE storyId=?",
            [inputFromForm, storyId],       // passing inputForm and storyId
            function(err)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );

                res.redirect('/queued/project/'+ projectId);

            });

    };
