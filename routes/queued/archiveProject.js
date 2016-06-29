/**
 * Created by Juanito on 6/26/16.
 * This module will archive projects.
 */

var connection =        require('../dbConnection.js').dbConnect();



module.exports =
    function archiveProject(req , res , next){

        var id = req.params.projectId;
        var inputFromForm = {
            archived    :   1
        };
        console.log(inputFromForm);
        connection.query("UPDATE QueuedProjects set ? WHERE projectId=?",
            [inputFromForm, id],
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/queued');
            });
    };