/**
 * Created by Juanito on 6/19/16.
 * This module will be used to edit a project
 */
var connection =        require('../dbConnection.js').dbConnect();
var dbFunctions = require('../../dbFunctions.js');
var _ = require('underscore');


module.exports =
    function editProject(req , res , next){
        // variable to hold all users
        var all_users;

        //get all active users from DB
        dbFunctions.getUsernames(function(result) {
            var members;
            members = _.pluck(result, 'username');
            all_users = JSON.stringify(members);
            console.log("All users: ");
            console.log(all_users);
        });

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
                        js: ['clickActions.js','jquery-ui.min.js','jquery-3.0.0.min.js'],
                        data:   rows[0],
                        members: test,
                        all_users: all_users,
                        user: req.user});
            });
    };
