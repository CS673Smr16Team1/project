var connection =
    require('./../dbConnection.js').dbConnect();

module.exports =  function saveImage(req , res){

    console.log(req.file);
    console.log(req);

    var id = req.body.id

    var inputFromForm = {
        OriginalName: req.file.originalname,
        ImageFilePath: req.file.path,
        IssueId: req.body.id
    };

    connection.query('INSERT INTO IssueImages set ?',
        inputFromForm,
        function(err){
            if(err) {
                console.log("Error Inserting : %s ", err);
            }
            res.redirect('/issues/issue-log');
        });

};
