var connection = require('./../dbConnection.js').dbConnect();

module.exports =
    function bugsJSON(req, res){
      connection.query('SELECT * FROM Issues WHERE IssueStatus != "Rejected" AND IssueStatus != "Resolved"',
        function(err,rows){
          if(err) {
            console.log("Error Selecting : %s ", err);
          }
          res.json(rows);
        });
      };
