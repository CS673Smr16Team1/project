/**
 * Created by Chris on 6/11/2016.
 */
var socket = io();
var curRoom = "general";

function switchRoom(room) {
    window.curRoom = room;
    socket.emit('switchRoom', room);
}

function padTimeWithZero(num) {
    if(num.toString().length===1)
        num = "0" + num;
    return num;
}
function multiLine(str) {
    // multi-line messages are stored in the database as 'line one \n line two'. First, replace the \n with a <br> tag.
    // Next, strip all html tags except the br tag.
    return str.replace(/\n/g,"<br>").replace(/<(?!br\s*\/?)[^>]+>/g);
}

$(document).ready(function () {

    //use GitHub username, or 'testing' if authentication is skipped during testing
    var username = $("#username").html() || 'testing';

    socket.on('connect', function () {
        socket.emit('adduser', username);
    });

    socket.on('updatechat', function (username, data, msgDate) {
        var messages = $('#messages');
        var msg='';
        if(msgDate) {
            var dt = new Date(msgDate);
            msg=username + ' (' + $.datepicker.formatDate("M d, yy ", dt) + padTimeWithZero(dt.getHours()) +
                ':' + padTimeWithZero(dt.getMinutes()) + ':' + padTimeWithZero(dt.getSeconds()) + '): ' + data;

        }
        else {
            msg=username + ': ' + data;
        }
        messages.append($('<li>').html(multiLine(msg)));
        messages.scrollTop(messages[0].scrollHeight - messages[0].clientHeight);

    });

    socket.on('updaterooms', function (rooms, current_room) {
        $('#channelList').empty();
        $.each(rooms, function (key, value) {
            if (value == current_room) {
                $('#channelList').append('<li id="' + value + '" role="presentation" class="active">' + value + '</li>');
            }
            else {
                $('#channelList').append('<li id="' + value + '" role="presentation"><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></li>');
            }
        });

        $("#channelCount").text("Channels (" + rooms.length + ")");
    });

    socket.on('updateUsernames', function (usernames) {
        var userList = $('#userList');
        userList.empty();

        usernames.forEach(function (uName) {

            userList.append('<li>' + uName.username +'</li>');
        });

        $("#userCount").text("Private Messages (" + usernames.length + ")");

        userList.scrollTop(userList[0].scrollHeight - userList[0].clientHeight);
    });

    socket.on('refreshmessages', function(data) {
        var messages = $('#messages');
        messages.empty();
        var sender, msgDate, msg;
        $.each(data, function (key, value) {
            sender = value.username;
            var dt = new Date(value.message_date);
            msgDate = $.datepicker.formatDate("M d, yy ", dt) + padTimeWithZero(dt.getHours()) + ':' +
                padTimeWithZero(dt.getMinutes()) + ':' + padTimeWithZero(dt.getSeconds());
            msg = value.message_content;

            messages.append($('<li>').html(sender + ': ' + multiLine(msg)));
        });
        messages.scrollTop(messages[0].scrollHeight - messages[0].clientHeight);
    });

    $('#msgForm').keypress(function(event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            $(this).submit(); //Submit your form here
            return false;
        }
    });

    $('#msgForm').submit(function () {
        socket.emit('sendchat', $('#chatInput').val());
        $('#chatInput').val('');
        return false;
    });

    $('.roomCreation').submit(function () {
        var name = $('#newChannelName').val();

        //check channel name
        var pattern = /^(?=.{1,30}$)[\w+]([ \w])*$/;
        var result = pattern.test(name);
        if(!result) {
            $('.modal-footer p').html('Channel name must be between 1 and 30 alphanumeric characters with optional spaces.');
        }
        else {
            //check if channel already exists
            $.ajax({
                type: 'GET',
                url: '/chat-api/create-channel/' + name,
                success: function(data) {
                    if(data[0].exists) {
                        $('.modal-footer p').html('Channel already exists.');
                    }
                    else {
                        socket.emit('create', name);
                        $('#myModal').modal('hide');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log('ajax error:' + xhr.status + ' ' + thrownError);
                }
            });


        }

        return false;
    });

    $('#myModal').on('hidden.bs.modal', function () {
        //erase error msg
        $('.modal-footer p').html('');
        //clear channel name
        $('#newChannelName').val('');
    });

    $('#myModal').on('shown.bs.modal', function () {
        $('#newChannelName').focus();
    });

});
