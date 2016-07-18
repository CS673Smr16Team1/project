/**
 * Created by jackie on 6/5/16.
 * This route will display the list of open issues
 */
var connection = require('./../dbConnection.js').dbConnect();

module.exports =
    function displayBugsClosed(req, res){
      connection.query('SELECT Issues.Id, Summary, IssueStatus, Priority, LastModifiedDate, AssignedTo, COUNT(IssueComments.IssueId) AS numComments FROM Issues LEFT JOIN IssueComments ON Issues.Id = IssueComments.IssueId WHERE IssueStatus NOT IN ("NEW","ASSIGN","OPEN","TEST","VERIFIED","REOPENED") OR Archived = 1  GROUP BY Issues.Id ORDER BY LastModifiedDate DESC',
        function(err,rows){
          if(err) {
            console.log("Error Selecting : %s ", err);
          }
          res.render('bugsClosed', {
            title: 'Closed Bugs | μProject',
            bugsSelected: 'active',
            data: rows,
            user: req.user,
            css: ['bugs-log.css',
                  'jplist.checkbox-dropdown.css'],
            js: ['jplist.core.js',
                 'jplist.checkbox-dropdown.js',
                 'jplist.textbox-filter.js',
                 'jplist.bootstrap-pagination-bundle.js',
                 'bugs-log.js']
          });
        });
      };
