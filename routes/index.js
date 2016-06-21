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
var issueLogRoute = require("./issues/issue-log");
var issueCreateRoute = require("./issues/issue-create");
var issueDetailRoute = require("./issues/issue-detail");
var issueSaveRoute = require("./issues/issue-save");
var issueDeleteRoute = require("./issues/issue-delete");
var issueUploadImageRoute = require("./issues/issue-upload-image");
var issueAddCommentRoute = require("./issues/issue-add-comment");


router.get('/issues/issue-create', ensureAuthenticated, issueCreateRoute.displayCreateIssue);
router.get('/issues/issue-log', ensureAuthenticated, issueLogRoute);
router.get('/issues/issue-detail/:id', ensureAuthenticated, issueDetailRoute);

router.post('/issues/issue-create', ensureAuthenticated, issueCreateRoute.createIssue);
router.post('/issues/issue-save/:id', ensureAuthenticated, issueSaveRoute);
router.post('/issues/issue-delete/:id', ensureAuthenticated, issueDeleteRoute);
router.post('/issues/issue-upload-image/:id', ensureAuthenticated, issueUploadImageRoute);
router.post('/upload', ensureAuthenticated, uploading.single('image'), issueUploadImageRoute);
router.post('/issues/issue-add-comment/:id', ensureAuthenticated, issueAddCommentRoute);


// shared modules
var loginRoute = require("./login");
var homeRoute = require("./home");

router.get('/', homeRoute);
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
