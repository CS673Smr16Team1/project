var express = require('express');
var router = express.Router();

// other modules
var homeRoute = require("./home");
var requirementsRoute = require("./requirements");
var chatRoomRoute = require("./chat-room");
var issueLogRoute = require("./issue-log");
var sampleDataRoute = require("./sampleData");
var addCar 			= require("./addCar");
var saveCar 			= require("./saveCar");
var editCar 			= require("./editCar");
var saveAfterEdit 	= require("./saveAfterEdit");
var deleteCar 		= require("./deleteCar");

// router specs
router.get('/', homeRoute);
router.get('/requirements', requirementsRoute);
router.get('/chat-room', chatRoomRoute);
router.get('/issue-log', issueLogRoute);
router.get('/sample-data', sampleDataRoute);
router.get('/sample-data/add', 				addCar);
router.post('/sample-data/add', 			saveCar);
router.get('/sample-data/edit/:id', 	editCar);
router.post('/sample-data/edit/:id', 	saveAfterEdit);
router.get('/sample-data/delete/:id', deleteCar);

module.exports = router;
