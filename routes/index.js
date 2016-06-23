var express = require('express');
var passport = require('passport');
var multer = require('multer');
var router = express.Router();

var uploading = multer({
    dest: './public/uploads/'
});


// chat room modules
var chatRoomRoute = require("./chat/chat-room");
var createChannelRoute = require("./chat/chat-api/create-channel");
router.get('/chat-room', ensureAuthenticated, chatRoomRoute);
router.get('/chat-api/create-channel/:channelName', createChannelRoute);


// requirements modules
var requirementsRoute = require("./requirements");
var addProjectRoute = require("./requirements/addProject");     // route for creating new project
var editProject	     = require("./requirements/editProject");                     // Route for Editing a project
var saveProjectAfterEdit = require("./requirements/saveProjectAfterEdit");
var saveProjectRoute = require("./requirements/saveProject");
var viewProjectRoute = require("./requirements/viewProject");   // View detail stories of a specific project
var addStoryRoute = require("./requirements/addStory");         // Route for View to add a new story to a project
var saveStoryRoute = require("./requirements/saveStory");       // Route for Save a new story to a project with Id
var viewStoryDetailRoute = require ("./requirements/viewStory");// Route for View detail of a story
var deleteStoryRoute = require("./requirements/deleteStory");   // Route for Delete a story
var updateStoryRoute = require("./requirements/updateStory");   // Route for Update a story

// router.get for requirements
router.get('/requirements', ensureAuthenticated, requirementsRoute);
router.get('/requirements/editProject/:projectId', ensureAuthenticated, editProject);
router.get('/requirements/:add', ensureAuthenticated, addProjectRoute);
router.get('/requirements/project/:projectId', ensureAuthenticated, viewProjectRoute);
router.get('/requirements/project/:projectId/story-create', ensureAuthenticated, addStoryRoute);
router.get('/requirements/project/:projectId/:storyId', ensureAuthenticated, viewStoryDetailRoute);

// router.post for requirements
router.post('/requirements/project/:projectId/story-create', ensureAuthenticated, saveStoryRoute);
router.post('/requirements/project/:projectId/:storyId/story-delete', ensureAuthenticated, deleteStoryRoute);
router.post('/requirements/project/:projectId/:storyId/story-update', ensureAuthenticated, updateStoryRoute);
router.post('/requirements/:add', ensureAuthenticated, saveProjectRoute);
router.post('/requirements/editProject/:projectId', ensureAuthenticated, saveProjectAfterEdit);


// issue modules
var issueLogRoute = require("./bugs/bugs-log");
var bugsJSONRoute = require("./bugs/bugs-json");
var issueCreateRoute = require("./bugs/bugs-create");
var issueDetailRoute = require("./bugs/bugs-detail");
var issueSaveRoute = require("./bugs/bugs-save");
var issueDeleteRoute = require("./bugs/bugs-archive");
var issueUploadImageRoute = require("./bugs/bugs-upload-image");
var issueAddCommentRoute = require("./bugs/bugs-add-comment");


router.get('/bugs/bugs-create', ensureAuthenticated, issueCreateRoute.displayCreateIssue); // route for returning an empty create issue page
router.get('/bugs/data.json', ensureAuthenticated, bugsJSONRoute); // route for returning issue data for log view
router.get('/bugs/bugs-log', ensureAuthenticated, issueLogRoute); // route for returning issue log view
router.get('/bugs/bugs-detail/:id', ensureAuthenticated, issueDetailRoute); // route for returning an issue detail view

router.post('/bugs/bugs-create', ensureAuthenticated, issueCreateRoute.createIssue); // route for creating an issue in the database
router.post('/bugs/bugs-save/:id', ensureAuthenticated, issueSaveRoute); // route for saving an updated issue detail page
router.post('/bugs/bugs-archive/:id', ensureAuthenticated, issueDeleteRoute); // route for archiving an issue
router.post('/bugs/bugs-upload-image/:id', ensureAuthenticated, issueUploadImageRoute); // route for saving an image to the database
router.post('/upload', ensureAuthenticated, uploading.single('image'), issueUploadImageRoute); // route for uploading an image
router.post('/bugs/bugs-add-comment/:id', ensureAuthenticated, issueAddCommentRoute); // route for adding a comment to an issue detail page


// shared modules
var loginRoute = require("./login");
var homeRoute = require("./home");
var settingsRoute = require("./settings");

router.get('/', homeRoute);
router.get('/settings', ensureAuthenticated, settingsRoute);
router.get('/login', loginRoute);
router.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));
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
