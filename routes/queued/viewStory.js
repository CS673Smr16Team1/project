/**
 * Created by sangjoonlee on 2016-06-11.
 */

// connect to DB
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function viewStory(req , res , next){

        var storyId = req.params.storyId;
        var projectId = req.params.projectId;
        var project_name;
        console.log("projectId in Story : %s ", projectId);

        connection.query('SELECT * FROM QueuedStory WHERE storyId = ?',
            storyId,
            function(err,rows) {
                connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                    projectId,
                    function (err, projectName) {
                        connection.query('SELECT * FROM users',
                            function (err, users) {

                                console.log(rows);
                                if (err) {
                                    console.log("Error Selecting : %s ", err);
                                }
                                project_name = projectName[0].project_name;

                                res.render('queuedStoryView', {
                                    title: 'Queued | Project ' + project_name + ' Story Id: ' + storyId + ' | μProject',
                                    queuedSelected: 'active',
                                    project_name: project_name,
                                    css: ['bootstrap-markdown.css',
                                          'jquery-ui.css',
                                          'queued-detail.css'],
                                    js: ['clickActions.js', 'bootstrap-markdown.js'],
                                    data: rows[0],
                                    user: req.user,
                                    members: users
                                });
                            });

                    });
            });


    };
