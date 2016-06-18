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
    connection.query("INSERT INTO users SET ?",
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

var f7 = function(channelName, callback) {
    connection.query("SELECT id FROM ChatNowChannel WHERE channel_name =?",
        [channelName],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

var f8 = function(inputs) {
    connection.query("INSERT INTO ChatNowPublicMessage SET ?",
        [inputs],
        function(err, rows) {
            if (err)
                console.log("Error inserting: %s ", err);
        })
};

var f9 = function(channelId, callback) {
    var qry = "SELECT username, message_date, message_content FROM users INNER JOIN ChatNowPublicMessage ";
    qry += "on users.idusers=ChatNowPublicMessage.sender_id WHERE channel_id =? order by 2";
    connection.query(qry,
        [channelId],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

var f10 = function(senderReceiverUsernames, callback) {
    var qry = "SELECT idusers FROM users WHERE username IN(?) order by 1";
    connection.query(qry,
        [senderReceiverUsernames],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

var f11 = function(inputs) {
    connection.query("INSERT INTO ChatNowPrivateMessage SET ?",
        [inputs],
        function(err, rows) {
            if (err)
                console.log("Error inserting: %s ", err);
        })
};

var f12 = function(person1Id, person2Id, callback) {
    var qry = "SELECT username, message_date, message_content FROM users INNER JOIN ChatNowPrivateMessage  ";
    qry += "on users.idusers=ChatNowPrivateMessage.sender_id WHERE (sender_id = " + connection.escape(person1Id);
    qry += " and recipient_id = " + connection.escape(person2Id) +") or (recipient_id = " + connection.escape(person1Id);
    qry += " and sender_id = " + connection.escape(person2Id) +") order by 2;";
    connection.query(qry,
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

var f13 = function(email, id) {
    connection.query("UPDATE users SET email = ? WHERE idusers = ?",
        [email, id],
        function(err, rows) {
            if (err)
                console.log("Error updating: %s ", err);
        })
};

var f14 = function(id, callback) {
    connection.query("SELECT email FROM users WHERE idusers = ?",
        [id],
        function(err, rows) {
            if (err)
                console.log("Error selecting: %s ", err);
            return callback(rows);
        });
};

module.exports = {
  userExists: f1,
    createUser: f2,
    getUsernames: f3,
    getChannels: f4,
    channelExists: f5,
    createChannel: f6,
    getChannelIdFromChannelName: f7,
    archivePublicMessage: f8,
    getPublicMessages: f9,
    getSenderReceiverIds: f10,
    archivePrivateMessage: f11,
    getPrivateMessages: f12,
    updateUserEmail: f13,
    getUserEmail: f14
};