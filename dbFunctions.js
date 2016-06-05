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

module.exports = {
  userExists: f1,
    createUser: f2
};