/**
 * Created by sangjoonlee on 2016-06-11.
 */

// connect to DB
var connection = require('../dbConnection.js').dbConnect();
var async = require("async");


module.exports =
    function viewStory(req , res , next){

        var storyId = req.params.storyId;
        var projectId = req.params.projectId;
        console.log("projectId in Story : %s ", projectId);
        console.log("storyID in Story : %s ", storyId);

        async.series([
                function(callback) {
                    // Get all row with storyId = storyID
                    connection.query('SELECT * FROM QueuedStory WHERE storyId = ?',
                        storyId,
                        function(err,rows) {
                            console.log("rows : %s ", rows);
                            return callback(null, rows);
                        });
                },
                function(callback){
                    // Get project_name and description with ProjectID = ID
                    connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                        projectId,
                        function (err,projectName) {
                            console.log("projectName : %s ", projectName[0]);
                            return callback(null, projectName);
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
                    // Get rows where projectID and story_status is backlog
                    connection.query('SELECT * FROM users',
                        function (err,users) {
                            console.log("users : %s ", users);
                            return callback(null, users);
                        });
                }
            ],

            // callback to call StoryCreateView
            function(err, results){

                //results[0] - story
                //results[1] - projectname
                //results[2] - users
                console.log("result[0] : %s ", results[0]);

                var formatDateYYYYMMDD;
                var formatDateMMDDYYYY;
                var project_name = results[1][0].project_name;
                var storyDetail = results[0];
                var data = results[0][0];
                console.log("storyDetail : %s ", storyDetail);

                var memberListStr = JSON.parse(results[2]);
                console.log(memberListStr);

                console.log("storyDetail : %s ", memberListStr);


                date = new Date(storyDetail[0].due_date);
                formatDateMMDDYYYY = ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "-" + date.getFullYear();
                    //06-30-2016
                formatDateYYYYMMDD = date.getFullYear() + "-" +("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);


                res.render('queuedStoryView', {
                        title: 'Queued | Project ' + project_name + ' Story Id: ' + storyId + ' | μProject',
                        queuedSelected: 'active',
                        project_name: project_name,
                        css: ['bootstrap-markdown.css', 'queued-detail.css'],
                        js: ['clickActions.js', 'bootstrap-markdown.js'],
                        data: data,
                        due_date_view: formatDateMMDDYYYY,
                        due_date_edit: formatDateYYYYMMDD,
                        user: req.user,
                        members: memberListStr
                    });



            });
/*

        connection.query('SELECT * FROM QueuedStory WHERE storyId = ?',
            storyId,
            function(err,rows) {
                connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                    projectId,
                    function (err, projectName) {
                        connection.query('SELECT * FROM users',
                            function (err, users) {

                                if (err) {
                                    console.log("Error Selecting : %s ", err);
                                }
                                console.log(rows);

                                project_name = projectName[0].project_name;
                                dateString = rows[0].due_date;
                                console.log("dateString : %s ", dateString);

                                date = new Date(dateString.due_date);
                                properlyFormatted = ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "-" + date.getFullYear();
                                //06/30/2016

                                res.render('queuedStoryView', {
                                    title: 'Queued | Project ' + project_name + ' Story Id: ' + storyId + ' | μProject',
                                    queuedSelected: 'active',
                                    project_name: project_name,
                                    css: ['bootstrap-markdown.css',
                                          'jquery-ui.css',
                                          'queued-detail.css'],
                                    js: ['clickActions.js', 'bootstrap-markdown.js'],
                                    data: rows[0],
                                    due_date: properlyFormatted,
                                    user: req.user,
                                    members: users
                                });
                            });

                    });
            });


*/

    };
