/**
 * Created by Juanito on 6/9/16.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveProject(req , res , next){
        console.log(req.body.members);
        console.log("from req body: " + req.body.members);

        var project_members = JSON.stringify(req.body.members);
        console.log(project_members);
        console.log("from project_member value: " + project_members);

        var inputFromForm = {
            project_name    :   req.body.project_name,
            Description     :   req.body.project_description,
            owner           :   req.user.username,
            members         :   project_members,
            archived    :   0
        };
        connection.query("INSERT INTO QueuedProjects set ? ",
            inputFromForm,
            function(err)
            {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/queued');
            });
    };