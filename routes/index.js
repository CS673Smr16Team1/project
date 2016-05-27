var express = require('express');
var router = express.Router();

// other modules
var homeRoute = require("./home");
var requirementsRoute = require("./requirements");
var chatRoomRoute = require("./chat-room");
var issueLogRoute = require("./issue-log");
var sampleDataRoute = require("./sampleData");

// router specs
router.get('/', homeRoute);
router.get('/requirements', requirementsRoute);
router.get('/chat-room', chatRoomRoute);
router.get('/issue-log', issueLogRoute);
router.get('/sample-data', sampleDataRoute);

module.exports = router;
