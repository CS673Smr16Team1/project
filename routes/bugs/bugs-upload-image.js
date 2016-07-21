/**
 * Created by jackie on 6/5/16.
 * This route will insert an issue's screenshot into the uploads folder
 */

var connection = require('./../dbConnection.js').dbConnect();
var async = require("async");

module.exports = function saveImage(req, res) {

    var issueId = req.body.id;

    var inputFromForm = {
        OriginalName: req.file.originalname,
        ImageFilePath: req.file.path,
        IssueId: req.body.id,
        FileName: req.file.originalname
    };


    async.series([
        function(callback) {
            connection.query('INSERT INTO IssueImages set ?',
                inputFromForm, function (err) {
                    if (err) {
                        console.log("Error Inserting : %s ", err);
                        res.redirect(req.get('referer'));
                    } else {
                        callback();
                    }
                });

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