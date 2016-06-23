/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function viewProject(req, res, next){

        var projectId;
        var project_name;
        var status_Backlog = "Backlog";
        var status_Current = "Current";
        var status_Done = "Done";
        var status_Release = "Release";


        projectId = req.params.projectId;

        connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
            [projectId, status_Backlog],
            function(err,rows) {
                if (err) {
                    console.log("Error Get all Stories : %s ", err);
                }
                console.log(rows);
                
            }
        );
/*
        SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
        FROM Orders
        INNER JOIN Customers
        ON Orders.CustomerID=Customers.CustomerID;
*/

        // query all stories that are related to this project

        connection.query('SELECT * FROM QueuedStory WHERE projectId = ?',
            projectId ,
            function(err,rows){
                connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                projectId,
                    function(err,projectName) {
                        connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                            [projectId, status_Backlog],
                            function(err,Backlog) {
                                connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                    [projectId, status_Current],
                                    function (err, Current) {
                                        connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                            [projectId, status_Done],
                                            function (err, Done) {
                                                connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                                    [projectId, status_Release],
                                                    function (err, Release) {


                                                        if (err) {
                                                            console.log("Error Get all Stories : %s ", err);
                                                        }

                                                        // #debug: printing projectId of the currently requested view
                                                        console.log("projectId: %s", projectId);
                                                        console.log("projectName: %s", projectName[0].project_name);
                                                        project_name = projectName[0].project_name;

                                                        res.render('queuedProjectView',
                                                            {
                                                                title: 'Queued | Project: ' + project_name + ' | μProject',
                                                                requirementsSelected: 'pure-menu-selected',
                                                                projectId: projectId,
                                                                project_name: project_name,
                                                                js: ['clickActions.js'],
                                                                data: rows,
                                                                backlog: Backlog,
                                                                current: Current,
                                                                done: Done,
                                                                release: Release,
                                                                user: req.user
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    };
