
var connection =
    require('./dbConnection.js').dbConnect();


module.exports =
    function displayIssueLog(req, res){
        connection.query('SELECT * FROM Issues',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('issueLogView', {
                    title: 'Project - Issue Log',
                    issueLogSelected: 'pure-menu-selected',
                    data: rows,
                    user: req.user});

            });
    };
