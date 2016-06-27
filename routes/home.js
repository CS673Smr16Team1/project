var connection = require('./dbConnection.js').dbConnect();

module.exports =
    function displayHomePage(req, res){
      var username = username = req.user ? req.user.username : "Anonymous"
      connection.query('SELECT Issues.Id, Summary, IssueStatus, Priority, LastModifiedDate, AssignedTo, COUNT(IssueComments.IssueId) AS numComments FROM Issues LEFT JOIN IssueComments ON Issues.Id = IssueComments.IssueId WHERE IssueStatus != "Rejected" AND IssueStatus != "Closed" AND Archived != 1 AND AssignedTo = ? GROUP BY Issues.Id ORDER BY LastModifiedDate DESC LIMIT 3',
      username,
      function(err,bugsData){
        if(err) {
          console.log("Error Selecting : %s ", err);
        }
        res.render('homeView', {
            title: 'μProject | A Tiny Project Management Service',
            homeSelected: 'active',
            css: ['bugs-log.css'],
            bugs: bugsData,
            user: req.user});
    });
};
