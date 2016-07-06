/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveStory(req , res , next){

        var projectId = req.params.projectId;

        var inputFromForm = {
            projectId: parseInt(projectId),
            title: req.body.title,
            description: req.body.description,
            story_status: req.body.story_status,
            assignee: req.body.assignedTo,   // need to update to user name of member projects
            type: req.body.type,
            priority: req.body.priority
        };

        console.log ("testing...%s", req.body.priority);
        console.log ("testing...");

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query("INSERT INTO QueuedStory set ?",
            [inputFromForm],
            function(err)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );

                res.redirect('/queued/project/'+ projectId);


            });

    };
