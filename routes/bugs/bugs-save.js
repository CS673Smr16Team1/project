/**
 * Created by jackie on 6/5/16.
 * This route will update an existing issue
 */
var connection = require('./../dbConnection.js').dbConnect();

module.exports =
    function saveIssue(req , res){
        var id = req.params.id;

        var inputFromForm = {
            Summary: req.body.summary,
            Priority: req.body.priority,
            Severity: req.body.severity,
            IssueStatus: req.body.status,
            Description: req.body.content,
            LastModifiedBy: req.user.username,
            AssignedTo: req.body.assignedTo,
            LastModifiedDate: new Date()
        };

        connection.query("UPDATE Issues set ? WHERE Id=?",
            [inputFromForm, id],
            function(err) {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/bugs');
            });
    };
