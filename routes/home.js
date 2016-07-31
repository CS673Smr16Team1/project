var dbFunctions = require('../dbFunctions.js');
var Q = require('q');

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
            //console.log("active projects: ");
            //console.log(activeProjectCount);
        });

        //get archived project count
        dbFunctions.getArchivedProjectCount(function (result) {
            var archivedCount = JSON.stringify(result);
            archivedProjectCount = archivedCount;

            // console.log("archived projects: ");
            // console.log(archivedProjectCount);

        });

        //get open issue count
        dbFunctions.qOpenIssues(function (result) {
            var openIssues = JSON.stringify(result);
            openIssuesCount = openIssues;

            // console.log("open issues: ");
            // console.log(openIssuesCount);

        });

        //get closed issue count
        dbFunctions.qClosedIssues(function (result) {
            var closedIssues = JSON.stringify(result);
            closedIssuesCount = closedIssues;

            // console.log("closedissues: ");
            // console.log(closedIssuesCount);

        });

        if (req.user) {
            dbFunctions.getActiveProjectsPerUser(req.user.username, function (result) {
                currentUserProjects = result;

            });
        }

        var username = req.user ? req.user.username : "Anonymous";

        var userCounter = require('./chat/userCounter.js');

        Q.all([dbFunctions.qBugsDashboardQuery(username),
            dbFunctions.qMostRecentMessages(username)]).then(function (results) {
            var bugsData = results[0][0];
            var chatData = results[1][0];
            /*console.log(JSON.stringify(bugsData, null, 4));
            console.log('space');
            console.log(JSON.stringify(chatData, null, 4));*/

            res.render('homeView', {
                title: 'μProject | A Tiny Project Management Service',
                homeSelected: 'active',
                css: ['bugs-log.css'],
                bugs: bugsData,
                chatRecentMessages: chatData,
                user: req.user,
                bugsOpenCount: JSON.parse(openIssuesCount),
                bugsClosedCount: JSON.parse(closedIssuesCount),
                activeProjectCount: JSON.parse(activeProjectCount),
                archivedProjectCount: JSON.parse(archivedProjectCount),
                currentUserProjects: currentUserProjects
            });
        });
    };
