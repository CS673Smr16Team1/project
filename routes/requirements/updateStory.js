/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function updateStory(req , res , next){

        var projectId = req.params.projectId;
        var storyId = req.params.storyId;

        // get input data from form
        var inputFromForm = {
            projectId: parseInt(projectId),
            title: req.body.title,
            description: req.body.description,
            story_status: req.body.story_status,
            assignee: req.user.username,   // need to update to user name of member projects
            type: 'feature',
            priority: parseInt(req.body.priority)
        };

        // # debug print outs
        console.log ("testing update story...");

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        connection.query("UPDATE Story set ? WHERE storyId=?",
            [inputFromForm, storyId],       // passing inputForm and storyId
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );
                
                res.redirect('/requirements/project/'+ projectId);

            });

    };