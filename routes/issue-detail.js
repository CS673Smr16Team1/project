
var connection =
    require('./dbConnection.js').dbConnect();


module.exports =
    function displayIssueDetail(req, res){
        var id = req.params.id;

        connection.query('SELECT * FROM Issues WHERE Id = ?',
            id,
            function(err,rows){
                console.log(rows);
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('issueDetailView', {
                    title: 'Project - Issue Log',
                    issueLogSelected: 'pure-menu-selected',
                    data: rows[0],
                    user: req.user});

            });
    };
