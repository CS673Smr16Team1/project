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

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

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
                            // #Debug: console.log("Project Name from DB : %s ", project_name);
                            callback(null, project_name);
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
                            // #debug: console.log("Users from DB : %s ", users);
                            callback(null, users);
                        });
                }
            ],

            // callback to call StoryCreateView
            function(err, results){
                res.render('queuedStoryCreateView',
                    {
                        title: "Queued | Add Story | μProject",
                        queuedSelected: 'active',
                        projectId: projectId,
                        project_name: results[0],           // project name
                        css: ['bootstrap-markdown.css',
                              'santiago.datepicker.css',
                              'jquery-ui.css',
                              'queued-detail.css'],
                        js: ['clickActions.js', 'bootstrap-markdown.js'],
                        user: req.user,
                        members: results[1]                 // all users information
                    });
            });


    };
