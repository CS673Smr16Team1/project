/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveStory(req , res , next){

        var projectId = req.params.projectId;
        var date = new Date(req.body.datepicker);
        var properlyFormatted = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2);
        var maxPriority = 0;

        console.log("ProjectID: %s",projectId);
        // Get max priorityId from current Project for the specific story status
        // Example SQL Query for projectId = 1 AND story_status = 'Backlog':
        //     SELECT MAX(priorityId) FROM 673projectdev.QueuedStory WHERE projectId = 1 AND story_status = 'Backlog';
        connection.query("SELECT MAX(priorityId) FROM QueuedStory WHERE projectId = ? AND story_status = ?",
            [projectId, req.body.story_status],
            function(err, returnedProrityId)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );
                console.log("priorityID: %s",returnedProrityId[0].priorityId);

                maxPriority = returnedProrityId;
            });

        console.log(maxPriority[0]);


        var inputFromForm = {
            projectId: parseInt(projectId),
            title: req.body.title,
            description: req.body.description,
            story_status: req.body.story_status,
            assignee: req.body.assignedTo,   // need to update to user name of member projects
            type: req.body.type,
            priority: req.body.priority,
            priorityId: maxPriority + 1,
            due_date: properlyFormatted
        };

        console.log ("testing...%s", req.body.priority);
        console.log ("testing...%s", properlyFormatted);


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
