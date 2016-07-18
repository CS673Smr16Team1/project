/**
 * Created by sangjoonlee on 2016-06-09.
 */

var connection = require('./../dbConnection.js').dbConnect();
var async = require("async");

module.exports =
    function addStory(req , res , next){

        var projectId;
        var project_name;
        var users;

        projectId = req.params.projectId;
        var selected_status = req.params.statusVal;

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);
        console.log("Selected Status: %s",selected_status);


        async.series([
                function(callback) {
                    // Get Project Name for the ProjectId from DB
                    connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                        projectId,
                        function (err, projectName) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }

                            project_name = projectName[0].project_name;
                            callback(null, project_name);
                        });
                },
                function(callback){
                    // Get members from DB
                    // Example - SELECT username FROM 673projectdev.member WHERE projectId = 59;
                    // SELECT members FROM 673projectdev.QueuedProjects WHERE projectId = 59;
                    connection.query('SELECT members FROM QueuedProjects WHERE projectId = ?',
                        projectId,
                        function (err, membersList) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            callback(null, membersList[0].members);
                            console.log("members: %s ", membersList[0].members);

                        });
                },
                function(callback){
                    // Get users from DB
                    connection.query('SELECT * FROM users',
                        function (err, usersList) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            users = usersList;
                            callback(null, users);
                        });
                }
            ],

            // callback to call StoryCreateView
            function(err, results){

                var memberListStr = JSON.parse(results[1]);
                console.log(memberListStr);

                res.render('queuedStoryCreateView',
                    {
                        title: "Queued | Add Story | μProject",
                        queuedSelected: 'active',
                        projectId: projectId,
                        project_name: results[0],           // project name
                        css: ['bootstrap-markdown.css',
                              'jquery-ui.css',
                              'queued-detail.css'],
                        js: ['clickActions.js', 'bootstrap-markdown.js'],
                        story_status: selected_status,
                        user: req.user,
                        members: memberListStr                // all members of the project
                    });
            });


    };
