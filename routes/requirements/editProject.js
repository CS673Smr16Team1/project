/**
 * Created by Juanito on 6/19/16.
 * This module will be used to edit a project
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function editProject(req , res , next){
        var id = req.params.projectId;

        console.log("projectId: %s",id);

        connection.query('SELECT * FROM QueuedProjects WHERE projectId = ?',
            [id],

            function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ", err);
                res.render('editProjectView',
                    {

                        title: 'Queued - Project Detail View - projectId:' + id + ' | μProject',
                        requirementsSelected: 'pure-menu-selected',
                        data:   rows[0],
                        user: req.user});
            });
    };

