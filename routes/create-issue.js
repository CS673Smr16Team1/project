/**
 * Created by jackie on 6/5/16.
 */
var connection =
    require('./dbConnection.js').dbConnect();

var createIssue = {};


createIssue.displayCreateIssue = function displayIssueLog(req, res){
    res.render('createIssueView', {
        title: 'Project - Issue Log',
        issueLogSelected: 'pure-menu-selected',
        user: req.user
    });
};

createIssue.createIssue = function displayIssueLog(req, res){
    connection.query('SELECT * FROM Issues',
        function(err,rows){
            if(err) {
                console.log("Error Selecting : %s ", err);
            }
        res.render('issueDetailView', {
            title: 'Project - Issue Log',
            issueLogSelected: 'pure-menu-selected',

            user: req.user
        });

    });
};

module.exports = createIssue;

