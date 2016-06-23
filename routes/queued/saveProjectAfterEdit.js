/**
 * Created by Juanito on 6/19/16.
 * Module to be called after edits are summited via post.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveProject(req , res , next){
        var id = req.params.projectId;
        var inputFromForm = {
            project_name  : req.body.project_name,
            Description    : req.body.project_description
        };
        connection.query("UPDATE QueuedProjects set ? WHERE projectId=?",
            [inputFromForm, id],
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/queued');
            });
    };