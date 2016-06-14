/**
 * Created by jackie on 6/5/16.
 */
var connection =
    require('./dbConnection.js').dbConnect();

var createIssue = {};


createIssue.displayCreateIssue = function displayCreateIssue(req, res){
    res.render('issueCreateView', {
        title: 'Bugs - Create Issue | μProject',
        issueLogSelected: 'pure-menu-selected',
        user: req.user
    });
};

createIssue.createIssue = function saveIssue(req, res){

    var inputFromForm = {
        Summary: req.body.summary,
        Priority: req.body.priority,
        Severity: req.body.severity,
        IssueStatus: 'New',
        Description: req.body.description,
        CreatedBy: req.user.username,
        CreatedDate: new Date(),
        LastModifiedBy: req.user.username,
        LastModifiedDate: new Date()
    };

    connection.query('INSERT INTO Issues set ?',
        inputFromForm,
        function(err){
            if(err) {
                console.log("Error Inserting : %s ", err);
            }
            res.redirect('/issue-log');
    });
};

module.exports = createIssue;
