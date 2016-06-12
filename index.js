var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var _ = require('underscore');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;
var dbFunctions = require('./dbFunctions.js');

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
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Check if username exists in database. If not, insert it.
            dbFunctions.userExists(profile.username, function(result) {
                if(result.length===0) {
                    dbFunctions.createUser(profile.username);
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
            }
        }

    }));

app.set('view engine', 'handlebars');

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
    res.render('404');
});


// Socket.io for ChatNow

var rooms = [];
dbFunctions.getChannels(function(channels) {
    rooms = (_.pluck(channels, 'channel_name'));
});

io.on('connection', function(socket) {

    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'general';
        dbFunctions.getUsernames(function(usernames) {
            io.to('general').emit('updateUsernames', usernames);
        });

        socket.join('general');
        socket.emit('updatechat', 'SERVER', 'you have connected to general');
        socket.broadcast.to('general').emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, 'general');

    });

    socket.on('create', function(room) {
        rooms.push(room);
        io.emit('updaterooms', rooms, socket.room);
    });

    socket.on('sendchat', function(data) {
        io.to(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom) {
        var oldroom = socket.room;
        socket.leave(oldroom);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
});

http.listen(3000, function(){
  console.log('http://localhost:3000');
});
