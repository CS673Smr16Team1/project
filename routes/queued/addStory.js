/**
 * Created by sangjoonlee on 2016-06-09.
 */

var connection = require('./../dbConnection.js').dbConnect();


module.exports =
    function addStory(req , res , next){

        var projectId;
        var project_name;

        projectId = req.params.projectId;

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
            projectId,
            function (err, projectName) {
                connection.query('SELECT * FROM users',
                    function (err, users) {
                        if (err) {
                                console.log("Error Selecting : %s ", err);
                        }
                        console.log("projectName create Story: %s",projectName);

                        project_name = projectName[0].project_name;
                        
                        res.render('queuedStoryCreateView',
                            {
                                    title: "Queued | Add Story | μProject",
                                    queuedSelected: 'active',
                                    projectId: projectId,
                                    project_name: project_name,
                                    js: ['clickActions.js', 'bootstrap-markdown.js'],
                                    user: req.user,
                                    members: users
                            });
                    });

        });
    };
