/**
 * Created by jackie on 6/5/16.
 * This route will display the list of open issues
 */
var connection = require('./../dbConnection.js').dbConnect();

module.exports =
    function displayIssueLog(req, res){
      connection.query('SELECT * FROM Issues WHERE IssueStatus != "Rejected" AND IssueStatus != "Resolved"',
        function(err,rows){
          if(err) {
            console.log("Error Selecting : %s ", err);
          }
          res.render('bugsLogView', {
            title: 'Bugs - Issue Log | μProject',
            bugsSelected: 'active',
            data: rows,
            user: req.user,
            css: ['bootstrap-table.css'],
            js: ['bootstrap-table.js', 'bootstrap-table-flat-json.js', 'bootstrap-table-multiple-sort.js']
          });
        });
      };
