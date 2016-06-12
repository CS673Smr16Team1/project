/**
 * Created by Chris on 6/5/2016.
 */
var connection = require('./routes/dbConnection.js').dbConnect();

var f1 = function(username, callback) {
    connection.query("SELECT idusers FROM users WHERE username =?",
    [username],
    function(err, rows) {
        if (err)
            console.log("Error selecting: %s ", err);
        return callback(rows);
    });
};

var f2 = function(username) {
    connection.query("INSERT INTO users (username) VALUES(?)",
        [username],
        function(err, rows) {
            if (err)
                console.log("Error inserting: %s ", err);
        })
};

var f3 = function(callback) {
    connection.query("SELECT username FROM users",
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        })
};

var f4 = function(callback) {
    connection.query("SELECT channel_name FROM ChatNowChannel",
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        })
};

var f5 = function(channelname, callback) {
    connection.query("SELECT id FROM ChatNowChannel WHERE channel_name =?",
        [channelname],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

var f6 = function(channelname) {
    connection.query("INSERT INTO ChatNowChannel (channel_name) VALUES(?)",
        [channelname],
        function(err, rows) {
            if (err)
                console.log("Error inserting: %s ", err);
        })
};

module.exports = {
  userExists: f1,
    createUser: f2,
    getUsernames: f3,
    getChannels: f4,
    channelExists: f5,
    createChannel: f6
};