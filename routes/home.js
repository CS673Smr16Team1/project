var connection = require('./dbConnection.js').dbConnect();
var dbFunctions = require('../dbFunctions.js');

module.exports =
    function displayHomePage(req, res) {

        //variables to track active and archive project count
        var activeProjectCount;
        var archivedProjectCount;

        //variable to store all projects for current user

        var currentUserProjects;

        //get active projects count
        dbFunctions.getActiveProjectCount(function (result) {
            var activeCount = JSON.stringify(result);
            activeProjectCount = activeCount;
            console.log("active projects: ");
            console.log(activeProjectCount);
        });

        //get archived project count
        dbFunctions.getArchivedProjectCount(function (result) {
            var archivedCount = JSON.stringify(result);
            archivedProjectCount = archivedCount;

            console.log("archived projects: ");
            console.log(archivedProjectCount);

        });
        

        dbFunctions.getActiveProjectsPerUser(req.user.username,function(result){
            currentUserProjects = result;

        });


        var username = username = req.user ? req.user.username : "Anonymous";

        var userCounter = require('./chat/userCounter.js');

        connection.query('SELECT Issues.Id, Summary, IssueStatus, Priority, LastModifiedDate, AssignedTo, COUNT(IssueComments.IssueId) AS numComments FROM Issues LEFT JOIN IssueComments ON Issues.Id = IssueComments.IssueId WHERE IssueStatus != "Rejected" AND IssueStatus != "Closed" AND Archived != 1 AND AssignedTo = ? GROUP BY Issues.Id ORDER BY LastModifiedDate DESC LIMIT 3',
            username,
            function (err, bugsData) {
                if (err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('homeView', {
                    title: 'μProject | A Tiny Project Management Service',
                    homeSelected: 'active',
                    css: ['bugs-log.css'],
                    css: ['bugs-log.css'],
                    bugs: bugsData,
                    user: req.user,
                    activeProjectCount: JSON.parse(activeProjectCount),
                    archivedProjectCount: JSON.parse(archivedProjectCount),
                    currentUserProjects: currentUserProjects,
                    chatNowOnlineUsers: {
                        count: userCounter.getOnlineUserCount(),
                        isSingle: userCounter.getOnlineUserCount() === 1
                    }
                });
            });
    };
