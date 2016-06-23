/**
 * Created by sangjoonlee on 2016-06-09.
 */

var connection = require('./../dbConnection.js').dbConnect();


module.exports =
    function addStory(req , res , next){

        var projectId;
        projectId = req.params.projectId;

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query('SELECT * FROM users',
            function (err, users) {
                if (err) {
                        console.log("Error Selecting : %s ", err);
                }

                res.render('queuedStoryCreateView',
                    {
                            title: "Queued | Add Story | μProject",
                            queuedSelected: 'active',
                            projectId: projectId,
                            js: ['clickActions.js'],
                            user: req.user,
                            members: users
                    });
        });
    };
