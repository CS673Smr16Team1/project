/**
 *
 * File Name: viewMyPRoject.js
 *
 * This script queries all stories that are assigned to be for a specific project.
 *
 * Created by sangjoonlee on 2016-06-09.
 */
var connection = require('../dbConnection.js').dbConnect();
var async = require("async");

module.exports =
    function viewMyProject(req, res, next){

        var projectId;
        var project_name;
        var projectInfo;
        var projectInfoCB;
        var description;
        var status_Backlog = "Backlog";
        var status_Current = "Current";
        var status_Done = "Done";
        var status_Release = "Release";
        var myusername;

        projectId = req.params.projectId;
        myusername = req.user.username;

        // query all stories that are related to this project

        async.series([
                function(callback) {
                    // Get all row with projectID = project ID
                    connection.query('SELECT * FROM QueuedStory WHERE projectId = ?',
                        projectId,
                        function (err, rows) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            // #Debug: console.log("Project Name from DB : %s ", project_name);
                            callback(null, rows);
                        });
                },
                function(callback){
                    // Get project_name and description with ProjectID = ID
                    connection.query('SELECT project_name, description FROM QueuedProjects WHERE projectId = ?',
                        projectId,
                        function(err,projectInfolist) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            projectInfo = projectInfolist;
                            console.log("ProjectInfo : %s ", projectInfo);
                            console.log("ProjectInfo projectname : %s ", projectInfo[0].project_name);


                            callback(null, projectInfo);
                        });
                },
                function(callback){
                    // Get rows where projectID and story_status is backlog
                    connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ? AND archived =0 AND assignee=? ORDER BY priorityId ',
                        [projectId, status_Backlog, myusername],
                        function(err,Backlog) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            callback(null, Backlog);
                        });
                },
                function(callback){
                    // Get rows where projectID and story_status is current
                    connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ? AND archived =0 AND assignee=? ORDER BY priorityId ',
                        [projectId, status_Current, myusername],
                        function(err,Current) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            callback(null, Current);
                        });
                },
                function(callback){
                    // Get rows where projectID and story_status is done
                    connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ? AND archived =0 AND assignee=? ORDER BY priorityId',
                        [projectId, status_Done, myusername],
                        function(err,Done) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            callback(null, Done);
                        });
                },
                function(callback){
                    // Get rows where projectID and story_status is release
                    connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ? AND archived =0 AND assignee=? ORDER BY priorityId',
                        [projectId, status_Release, myusername],
                        function(err,Release) {
                            if (err) {
                                console.log("Error Selecting : %s ", err);
                            }
                            callback(null, Release);
                        });
                }
            ],

            // callback to call StoryCreateView
            function(err, results){
                projectInfoCB = results[1];

                res.render('queuedMyProjectView',
                    {
                        title: projectInfoCB[0].project_name + ' | ' + myusername + 's Story | μProject',
                        queuedSelected: 'active',
                        projectId: projectId,
                        project_name: projectInfoCB[0].project_name,
                        description: projectInfoCB[0].description,
                        data: results[0],
                        backlog: results[2],
                        current: results[3],
                        done: results[4],
                        release: results[5],
                        css: ['queued-projectview.css', 'bootstrap-editable.css'],
                        js: ['queued-project.js', 'bootstrap-editable.js'],
                        user: req.user
                    });
            });
    };
