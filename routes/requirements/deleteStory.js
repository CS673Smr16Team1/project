/**
 * Created by sangjoonlee on 2016-06-11.
 */

var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function deleteStory(req , res , next){

        var projectId = req.params.projectId;

        var inputFromForm = {
            projectId: parseInt(projectId),
            title: req.body.title,
            description: req.body.description,
            story_status: req.body.status,
            assignee: req.user.username,   // need to update to user name of member projects
            priority: req.body.priority
        };

        console.log ("testing...");

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query("INSERT INTO Story set ?",
            [inputFromForm],
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );

                /*    res.render('projectView', {
                 title: 'Project View',
                 projectId: projectId,
                 data: rows,
                 user: req.user
                 }
                 );
                 */
                res.redirect('/requirements/project/'+ projectId);


            });

    };