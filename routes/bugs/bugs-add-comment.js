/**
 * Created by jackie on 6/5/16.
 * This route will insert an issue's comment into the uploads folder
 */

var connection = require('./../dbConnection.js').dbConnect();
var async = require("async");

module.exports =  function saveImage(req , res){

    var issueId = req.params.id;

    var inputFromForm = {
        Comment: req.body.Comment,
        CreatedBy: req.user.username,
        CreatedDate: new Date(),
        IssueId: req.params.id
    };

    async.series([
        function(callback) {
            if(req.body.Comment != "") {
                connection.query('INSERT INTO IssueComments set ?',
                    inputFromForm,
                    function(err){
                        if(err) {
                            console.log("Error Inserting : %s ", err);
                        }
                        callback();
                    });
            } else {
                res.redirect(req.get('referer'));
            }

        },
        function(callback){
            connection.query('UPDATE Issues SET LastModifiedDate = NOW() WHERE Id = ?', issueId, function (err) {
                if (err) {
                    console.log("Error Inserting : %s ", err);
                }
                res.redirect(req.get('referer'));
            });
        },
    ]);
};
