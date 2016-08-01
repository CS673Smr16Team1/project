/**
 * Created by Juanito on 6/19/16.
 * Module to be called after edits are summited via post.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveProject(req , res , next){
        var id = req.params.projectId;

        var memberList;

        if (req.body.members !=  undefined){
            // Bug#75: checking if req.body.member is array or not.
            // Non-array is passed if there are one or less members assigned to the project.
            if (Array.isArray(req.body.members) == false) {
                // convert it into array
                memberList = req.body.members.split(',');
            } else{
                // if an array assigned it to memberList for processing
                memberList = req.body.members;
            }
            // Bug#75: fix completed
        } else {
            memberList = "";
        }

       // var project_members = JSON.stringify(req.body.members);
        var project_members = JSON.stringify(memberList);
        console.log(req.body.project_owner);

        var inputFromForm = {
            project_name    :   req.body.project_name,
            Description     :   req.body.project_description,
//            owner           :   req.body.project_owner,
            members         :   project_members
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

