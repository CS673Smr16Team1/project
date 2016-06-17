/**
 * Created by sangjoonlee on 2016-06-09.
 */

var connection =
    require('../dbConnection.js').dbConnect();


module.exports =
    function viewProject(req, res, next){

        var projectId;
        var project_name;

        projectId = req.params.projectId;
        project_name = req.params.project_name;

        // query all stories that are related to this project
        connection.query('SELECT * FROM QueuedStory WHERE projectId = ?',
            projectId,
            function(err,rows){
                if(err) {
                    console.log("Error Get all Stories : %s ", err);
                }

                // #debug: printing projectId of the currently requested view
                console.log("projectId: %s",projectId);
                console.log("project_name: %s",project_name);

                res.render('projectView',
                    {
                        title: 'Queued - Project Detail View - projectId:' + projectId + ' | μProject',
                        requirementsSelected: 'pure-menu-selected',
                        projectId: projectId,
                        data: rows,
                        user: req.user
                    });
            });
    };
