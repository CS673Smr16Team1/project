/**
 * Created by Juanito on 6/9/16.
 */
var connection =
    require('../dbConnection.js').dbConnect();
var dbFunctions = require('../../dbFunctions.js');
var _ = require('underscore');

module.exports =
    function saveProject(req , res , next){
        console.log(req.body.members);
        console.log("from req body: " + req.body.members);

        var memberList;

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

        var project_members= JSON.stringify(memberList);
        console.log(project_members);
        console.log("from project_member value: " + project_members);

        var inputFromForm = {
            project_name    :   req.body.project_name,
            Description     :   req.body.project_description,
            owner           :   req.user.username,
            members         :   project_members,
            archived    :   1
        };

        connection.query("INSERT INTO QueuedProjects set ? ",
            inputFromForm,
            function(err,result)
            {
                var membersToCreate = JSON.parse(project_members);
                if (err)
                    console.log("Error inserting : %s ",err );
                var projectId = result.insertId;
                console.log("membersToCreate:",membersToCreate);
                for (i = 0; i < membersToCreate.length; i++) {
                    console.log(membersToCreate[i]);
                    var currUserId;
                    dbFunctions.userExists(membersToCreate[i],function(result) {
                        var currResultQuery;
                        currResultQuery = result;
                        currUserId = JSON.stringify(currResultQuery);
                        currUserId = JSON.parse(currUserId);
                        console.log("iduser: ");
                        currUserId = currUserId[0].idusers;
                        console.log(currUserId);
                    });
                    dbFunctions.createProjectMember(currUserId,projectId,membersToCreate[i],function(err,rows){
                        if(!err){
                            return rows;
                        }else{
                            console.log(err);
                        }
                    });
                }
                console.log("test:", projectId);
                res.redirect('/queued');
            });
    };