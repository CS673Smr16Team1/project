/**
 * Created by sangjoonlee on 2016-06-09.
 */

var connection =
    require('../dbConnection.js').dbConnect();


module.exports =
    function viewProject(req, res, next){
        connection.query('SELECT * FROM Story',
            function(err,rows){
                if(err) {
                    console.log("Error Get all Stories : %s ", err);
                }
                res.render('projectView',
                    {title:"Project View",
                        data: rows
                    });

            });
    };