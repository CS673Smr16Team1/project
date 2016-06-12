var express = require('express');
var passport = require('passport');
var router = express.Router();


// chat room modules
var chatRoomRoute = require("./chat-room");
var createChannelRoute = require("./chat-api/create-channel");
router.get('/chat-room', ensureAuthenticated, chatRoomRoute);
router.get('/chat-api/create-channel/:channelName', createChannelRoute);


// requirements modules
var requirementsRoute = require("./requirements");
var addProjectRoute = require("./requirements/addProject");
var saveProjectRoute = require("./requirements/saveProject");
var viewProjectRoute = require("./requirements/viewProject");   // View detail stories of a specific project
var addStoryRoute = require("./requirements/addStory");         // View to add a new story to a project
var saveStoryRoute = require("./requirements/saveStory");       // Save a new story to a project with Id
var viewStoryDetailRoute = require ("./requirements/viewStory");// View detail of a story
//var deleteStoryRoute = require("./requirements/deleteStory");   // Delete a story

router.get('/requirements', ensureAuthenticated, requirementsRoute);
router.get('/requirements/:add', ensureAuthenticated, addProjectRoute);
router.get('/requirements/project/:projectId', ensureAuthenticated, viewProjectRoute);
router.get('/requirements/project/:projectId/story-create', ensureAuthenticated, addStoryRoute);
router.get('/requirements/project/:projectId/:storyId', ensureAuthenticated, viewStoryDetailRoute);
//router.post('/requirements/project/:projectId/:storyId', ensureAuthenticated, deleteStoryRoute);
router.post('/requirements/project/:projectId/story-create', ensureAuthenticated, saveStoryRoute);
router.post('/requirements/:add',ensureAuthenticated, saveProjectRoute);


// issue modules
var issueLogRoute = require("./issue-log");
var issueCreateRoute = require("./issue-create");
var issueDetailRoute = require("./issue-detail");
var issueSaveRoute = require("./issue-save");
var issueDeleteRoute = require("./issue-delete");

router.get('/issue-create', ensureAuthenticated, issueCreateRoute.displayCreateIssue);
router.get('/issue-log', ensureAuthenticated, issueLogRoute);
router.get('/issue-detail/:id', ensureAuthenticated, issueDetailRoute);
router.post('/issue-create', ensureAuthenticated, issueCreateRoute.createIssue);
router.post('/issue-save/:id', ensureAuthenticated, issueSaveRoute);
router.post('/issue-delete/:id', ensureAuthenticated, issueDeleteRoute);


// shared modules
var loginRoute = require("./login");
var homeRoute = require("./home");

router.get('/', homeRoute);
router.get('/login', loginRoute);
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
