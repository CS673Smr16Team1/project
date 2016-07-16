var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var _ = require('underscore');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;
var dbFunctions = require('./dbFunctions.js');
var encryption = require('./encryption.js');
var mailer = require('./mailer.js');
var queuedEmailScheduler = require('./queuedEmailScheduler.js');


var GITHUB_CLIENT_ID = "e42895897d3a576a6940";
var GITHUB_CLIENT_SECRET = "6e3279e0e6ab7763ce1c0a4c301016346af6de4c";

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback",
        scope: ['user:email']
    },
    function(accessToken, refreshToken, profile, done) {
        var testEnc = encryption.encrypt(profile.emails[0].value);
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Check if username exists in database. If not, insert it.
            dbFunctions.userExists(profile.username, function(result) {
                if(result.length===0) {
                    dbFunctions.createUser({
                        username: profile.username,
                        email: encryption.encrypt(profile.emails[0].value)
                    });
                }
                // else block would not normally be needed, but in our project when users were originally created,
                // email was not being saved at the time, so this code serves to fill it in after the fact
                else {
                    dbFunctions.updateUserEmail(encryption.encrypt(profile.emails[0].value), result[0].idusers);

                    /*dbFunctions.getUserEmail(result[0].idusers, function(emailRow) {
                       console.log(encryption.decrypt(emailRow[0].email));
                    });*/
                }
            });
            return done(null, profile);
        });
    }
));

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// for sessions
var sessionOptions = {
    secret: "test123",
    resave: true,
    saveUninitialized: false
};
app.use(session(sessionOptions));

// setup handlebars view engine
app.engine('handlebars',
    handlebars({defaultLayout: 'main_layout',
        helpers: { //this will help when displaying results in a table: records can start at index 1 instead of 0
            addOne: function (value) {
                return value + 1;
            },
            if_equals: function (a, b, opts) {
                if(a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            },
            dashboardChannel: function(channel, user) {
                if(channel.substring(0, 3) === 'DM:') {
                    // returns @ + the other user's username. Example: if the user is chriscarducci, then in the strings
                    // 'DM: chriscarducci-davidblair' and 'DM: davidblair-chriscarducci', it will return @davidblair in both cases.
                    var meLoc = channel.indexOf(user);
                    var rtnStr;
                    if(meLoc===4) {
                        rtnStr = channel.substring(5 + user.length, channel.length);
                    }
                    else {
                        rtnStr = channel.substring(4, meLoc - 1);
                    }
                    return '@' + rtnStr;
                }
                else {
                    return '#' + channel;
                }
            }

        }

    }));

app.set('view engine', 'handlebars');

// Handlebars time calculation and text filtering
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
var Filter = require("handlebars.filter");

MomentHandler.registerHelpers(Handlebars);
Filter.registerHelper(Handlebars);
Handlebars.registerHelper('markdown', require('helper-markdown'));

/* Helper to truncate text in rendering
   https://gist.github.com/TastyToast/5053642 */
Handlebars.registerHelper ('truncate', function (str, len) {
    if (str && str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr (0, len);
        new_str = str.substr (0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

        return new Handlebars.SafeString ( new_str +'...' );
    }
    return str;
});

// static resources
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Routing
var routes = require('./routes/index');
app.use('/', routes);

app.use(function(req, res) {
    res.status(404);
    res.render('404',{
        user: req.user
      });
});


// Socket.io for ChatNow

var rooms = [];
dbFunctions.getChannels(function(channels) {
    rooms = (_.pluck(channels, 'channel_name'));
});

var uProjectUsers = []; // for keeping track of who is online in any of the uProject sites
var chatUsers = []; // for keeping track of who is online in ChatNow, for email notifications

io.on('connection', function(socket) {


    socket.on('temp', function(username) {
        socket.username = username;
        socket.room = 'temp-room';

        uProjectUsers.push(username);

        io.emit('uProjectOnlineUserCount', _.uniq(uProjectUsers).length);
        io.emit('ChatNowOnlineUserCount', _.uniq(chatUsers).length);
    });

    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'general';

        uProjectUsers.push(username);

        io.emit('uProjectOnlineUserCount', _.uniq(uProjectUsers).length);

        dbFunctions.getUsernames(function(usernames) {
            io.emit('updateUsernames', usernames, chatUsers);
            io.emit('onlinestatus', username, 'online');
        });

        socket.join('general');

        //assign channelId to socket in preparation for archiving messages
        dbFunctions.getChannelIdFromChannelName(socket.room, function(result) {
            socket.channelId = result[0].id;
            dbFunctions.getPublicMessages(socket.channelId, function(result) {
                // Clear messages and load archived
                socket.emit('refreshmessages', result);
                socket.emit('updatechat', 'SERVER', 'you have connected to general');
            });
        });

        socket.broadcast.to('general').emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, 'general');

        //assign userId to socket in preparation for archiving messages
        dbFunctions.userExists(username, function(result) {
            socket.userId = result[0].idusers;
        });

        chatUsers.push(username);

        io.emit('ChatNowOnlineUserCount', _.uniq(chatUsers).length);
    });

    socket.on('create', function(room) {
        rooms.push(room);
        io.emit('updaterooms', rooms, socket.room);
    });

    socket.on('sendChatPublic', function(data) {
        var msgDate = new Date();
        io.to(socket.room).emit('updatechat', socket.username, data, msgDate);
        dbFunctions.archivePublicMessage({
            message_content: data, message_date: msgDate, sender_id: socket.userId, channel_id: socket.channelId
        });

    });

    socket.on('sendChatPrivate', function(data, recipientUsername) {
        var msgDate = new Date();
        io.to(socket.room).emit('updatechat', socket.username, data, msgDate);
        dbFunctions.userExists(recipientUsername, function(result) {
            dbFunctions.archivePrivateMessage({
                message_content: data, message_date: msgDate, sender_id: socket.userId, recipient_id: result[0].idusers
            });
        });

        // if the recipient is offline and has the email notification setting turned on, send an email notification
        if(_.indexOf(uProjectUsers, recipientUsername)===-1) {
            dbFunctions.getEmailNotificationStatusFromUsername(recipientUsername, function(result1) {
                if(result1[0].email_notification) {
                    dbFunctions.getUserEmailFromUsername(recipientUsername, function(result2) {
                        if(result2[0].email) {
                            var decryptedEmail = encryption.decrypt(result2[0].email);
                            mailer.sendEmail(socket.username, decryptedEmail, data);
                        }
                        else {
                            // no email on file for this recipient
                            console.log('no email in db for this recipient');
                        }
                    });
                }

            });

        }
        else {
            io.emit('newDirectMessage', socket.username, recipientUsername);
        }
    });

    socket.on('switchRoom', function(newroom) {
        var oldroom = socket.room;
        socket.leave(oldroom);
        socket.join(newroom);

        //assign channelId to socket in preparation for archiving messages
        dbFunctions.getChannelIdFromChannelName(newroom, function(result) {
            socket.channelId = result[0].id;
            dbFunctions.getPublicMessages(socket.channelId, function(result) {
                // Clear messages and load archived
                socket.emit('refreshmessages', result);
                socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
            });
        });

        socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);


    });

    socket.on('switchRoomPrivate', function(recipientUsername) {
        var oldroom = socket.room;
        socket.leave(oldroom);

        // query db to get userids of both the sender and recipient, which will be used to join a new room
        dbFunctions.getSenderReceiverIds([socket.username, recipientUsername], function(result) {
           //console.log(result[0].idusers + ' ' + result[1].idusers);
            var newroom = result[0].idusers + '-' + result[1].idusers;
            socket.join(newroom);

            dbFunctions.getPrivateMessages(result[0].idusers, result[1].idusers, function(result) {
                // Clear messages and load archived
                socket.emit('refreshmessages', result);
                socket.emit('updatechat', 'SERVER', 'you have connected to @' + recipientUsername);
            });

            socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
            socket.room = newroom;
            socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
            socket.emit('updaterooms', rooms, newroom);
        });


    });

    socket.on('archiveChannel', function(channel) {
        dbFunctions.archiveChannel(channel);
        rooms.splice(_.indexOf(rooms, channel), 1);
        socket.emit('updaterooms', rooms, socket.room);

    });

    socket.on('unarchiveChannel', function(channel) {
        dbFunctions.unarchiveChannel(channel);
        rooms.push(channel);
        socket.emit('updaterooms', rooms, socket.room);

    });

    socket.on('disconnect', function() {
        if(socket.room !== 'temp-room') {
            io.emit('onlinestatus', socket.username, 'offline');
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            var index = _.indexOf(chatUsers,socket.username);
            if (index > -1) {
                chatUsers.splice(index, 1);
            }
        }
        socket.leave(socket.room);
        var index2 = _.indexOf(uProjectUsers,socket.username);
        if (index2> -1) {
            uProjectUsers.splice(index2, 1);
        }

        io.emit('uProjectOnlineUserCount', _.uniq(uProjectUsers).length);
        io.emit('ChatNowOnlineUserCount', _.uniq(chatUsers).length);
    });
});

http.listen(3000, function(){
  console.log('http://localhost:3000');
});
