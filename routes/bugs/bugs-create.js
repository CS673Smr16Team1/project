/**
 * Created by jackie on 6/5/16.
 * This route will either return the empty create issue page
 * or will insert a new issue
 */
var connection =
    require('./../dbConnection.js').dbConnect();

var createIssue = {};


createIssue.displayCreateIssue = function displayCreateIssue(req, res) {
    connection.query('SELECT * FROM users', function (err, users) {
        if (err) {
            console.log("Error Selecting : %s ", err);
        }
        res.render('bugsCreateView', {
            title: 'Bugs - Create Issue | μProject',
            bugsSelected: 'active',
            css: ['bootstrap-markdown.css', 'bugs-create.css'],
            js: ['bootstrap-markdown.js'],
            user: req.user,
            users: users
        });
    });
};

createIssue.createIssue = function saveIssue(req, res){

    var inputFromForm = {
        Summary: req.body.summary,
        Priority: req.body.priority,
        Severity: req.body.severity,
        AssignedTo: req.body.assignedTo,
        IssueStatus: 'NEW',
        Description: req.body.content,
        CreatedBy: req.user.username,
        CreatedDate: new Date(),
        LastModifiedBy: req.user.username,
        LastModifiedDate: new Date(),
        Archived: 'False'
    };
    connection.query('INSERT INTO Issues set ?',
        inputFromForm,
        function(err){
            if(err) {
                console.log("Error Inserting : %s ", err);
                res.redirect('/bugs/create');
            } else {
                res.redirect('/bugs');
            }
    });
};

module.exports = createIssue;
