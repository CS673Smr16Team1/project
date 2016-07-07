/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection = require('../dbConnection.js').dbConnect();
var async = require("async");

module.exports =
    function saveStory(req , res , next){

        var projectId = req.params.projectId;
        var maxPriority = 0;

        console.log("ProjectID: %s",projectId);
        console.log("story_status: %s",req.body.story_status);

        async.series([
                function(callback) {
                    // Get max priorityId from current Project for the specific story status
                    // Example SQL Query for projectId = 1 AND story_status = 'Backlog':
                    //     SELECT MAX(priorityId) FROM 673projectdev.QueuedStory WHERE projectId = 1 AND story_status = 'Backlog';
                    connection.query("SELECT MAX(priorityId) as maxPriorityId FROM QueuedStory WHERE projectId = ? AND story_status = ?",
                        [projectId, req.body.story_status],
                        function (err, returnedProrityId) {
                            if (err)
                                console.log("Error inserting Story: %s ", err);

                            maxPriority = returnedProrityId[0].maxPriorityId;
                            console.log("Current Max Priority: %s", maxPriority);
                            return callback(null, maxPriority);
                        });
                }
            ],

            function(err, results) {

                var inputFromForm = {
                    projectId: parseInt(projectId),
                    title: req.body.title,
                    description: req.body.content,
                    due_date: req.body.duedate,
                    story_status: req.body.story_status,
                    assignee: req.body.assignedTo,   // need to update to user name of member projects
                    type: req.body.type,
                    priority: req.body.priority,
                    priorityId: results[0] + 1
                };

                console.log("Current Max Priority: %s", results[0]);

                // #debug: printing projectId of the currently requested view
                console.log("projectId: %s", projectId);

                connection.query("INSERT INTO QueuedStory set ?",
                    [inputFromForm],
                    function (err) {
                        if (err)
                            console.log("Error inserting Story: %s ", err);

                        res.redirect('/queued/project/' + projectId);

                    }
                );
            });
    };
