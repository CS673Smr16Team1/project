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
                var test = JSON.parse(rows[0].members);
                console.log(test);
                res.render('queuedEditProjectView',
                    {

                        title: 'Queued | Project Detail View - projectId:' + id + ' | μProject',
                        queuedSelected: 'active',
                        js: ['clickActions.js'],
                        data:   rows[0],
                        members: test,
                        user: req.user});
            });
    };
