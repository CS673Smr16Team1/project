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

        connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
            projectId,
            function(err,rows) {
                if (err) {
                    console.log("Error Get all Stories : %s ", err);
                }
                project_name = rows[0].project_name;
                console.log("project_name: %s",project_name);
                
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
            projectId,
            function(err,rows){
                connection.query('SELECT project_name FROM QueuedProjects WHERE projectId = ?',
                projectId,
                    function(err,projectName) {
                        if (err) {
                            console.log("Error Get all Stories : %s ", err);
                        }

                        // #debug: printing projectId of the currently requested view
                        console.log("projectId: %s", projectId);
                        console.log("projectName: %s", projectName[0].project_name);

                        res.render('queuedProjectView',
                            {
                                title: 'Queued | Project:' + projectId + ' | μProject',
                                requirementsSelected: 'pure-menu-selected',
                                projectId: projectId,
                                project_name: projectName,
                                js: ['clickActions.js'],
                                data: rows,
                                user: req.user
                            });
                    });
            });
    };
