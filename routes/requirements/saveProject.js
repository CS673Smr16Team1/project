/**
 * Created by Juanito on 6/9/16.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveCourse(req , res , next){

        var inputFromForm = {
            project_name  : req.body.project_name,
            Description    : req.body.project_description
        };
        connection.query("INSERT INTO Projects set ? ",
            inputFromForm,
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting : %s ",err );
                res.redirect('/requirements');
            });
    };