/**
 * Created by Chris on 7/16/2016.
 */
var socket = io();

$(document).ready(function () {

    //use GitHub username, or 'testing' if authentication is skipped during testing
    var username = $("#username").html() || 'testing';

    socket.on('connect', function () {
        if (username === 'testing') return;
        if (window.location.href.slice(-9) === 'chat-room') {
            socket.emit('adduser', username);
        }
        else {
            socket.emit('temp', username);
        }
    });

    socket.on('uProjectOnlineUserCount', function(count) {
       $('#uProjectOnlineUserCount').html(count);
    });

    socket.on('ChatNowOnlineUserCount', function(count) {
        $('#ChatNowOnlineUserCount').html(count);
    });

});