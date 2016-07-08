/**
 * Created by jackie on 6/5/16.
 * This route will insert an issue's comment into the uploads folder
 */

var connection =
    require('./../dbConnection.js').dbConnect();

module.exports =  function saveImage(req , res){

    var inputFromForm = {
        Comment: req.body.Comment,
        CreatedBy: req.user.username,
        CreatedDate: new Date(),
        IssueId: req.params.id
};


    if(req.body.Comment != "") {
        connection.query('INSERT INTO IssueComments set ?',
            inputFromForm,
            function(err){
                if(err) {
                    console.log("Error Inserting : %s ", err);
                }
                res.redirect(req.get('referer'));
            });
    }
    else {
        res.redirect(req.get('referer'));
    }


};
