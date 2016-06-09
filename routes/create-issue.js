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

    var inputFromForm = {
        Summary  : req.body.summary,
        Priority    : req.body.priority,
        Severity    : req.body.severity,
        IssueStatus      : 'New',
        Description    : req.body.description,
        CreatedBy       : req.user.username
    };

    connection.query('INSERT INTO Issues set ?',
        inputFromForm,
        function(err,rows){
            if(err) {
                console.log("Error Inserting : %s ", err);
            }
            console.log(rows);
        res.render('issueDetailView', {
            title: 'Project - Issue Log',
            issueLogSelected: 'pure-menu-selected',
            user: req.user
        });

    });
};

module.exports = createIssue;

