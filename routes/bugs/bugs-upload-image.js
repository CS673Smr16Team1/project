/**
 * Created by jackie on 6/5/16.
 * This route will insert an issue's screenshot into the uploads folder
 */

var connection = require('./../dbConnection.js').dbConnect();

module.exports =  function saveImage(req , res){

    console.log(req.file);
    console.log(req);
    
    var inputFromForm = {
        OriginalName: req.file.originalname,
        ImageFilePath: req.file.path,
        IssueId: req.body.id,
        FileName: req.file.originalname
    };

    connection.query('INSERT INTO IssueImages set ?',
        inputFromForm,
        function(err){
            if(err) {
                console.log("Error Inserting : %s ", err);
            }
            res.redirect(req.get('referer'));
        });

};
