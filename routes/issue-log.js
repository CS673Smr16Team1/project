
var connection =
    require('./dbConnection.js').dbConnect();


module.exports =
    function displayIssueLog(req, res){
        connection.query('SELECT * FROM Issues WHERE IssueStatus != "Rejected" AND IssueStatus != "Resolved"',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('issueLogView', {
                    title: 'Bugs - Open Issues',
                    issueLogSelected: 'pure-menu-selected',
                    data: rows,
                    user: req.user,
                    css: ['filter-table.css'],
                    js: ['filterTable.js']
                });

            });
    };
