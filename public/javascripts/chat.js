/**
 * Created by Chris on 6/11/2016.
 */
var socket = io();
var curRoom = "general";

function switchRoom(room) {
    window.curRoom = room;
    socket.emit('switchRoom', room);
}

$(document).ready(function () {

    //use GitHub username, or 'testing' if authentication is skipped during testing
    var username = $("#login span").html() || 'testing';

    socket.on('connect', function () {
        socket.emit('adduser', username);
    });

    socket.on('updatechat', function (username, data) {
        var messages = $('#messages');

        messages.append($('<li>').text(username + ': ' + data));
        messages.scrollTop(messages[0].scrollHeight - messages[0].clientHeight);

    });

    socket.on('updaterooms', function (rooms, current_room) {
        $('#channelList').empty();
        $.each(rooms, function (key, value) {
            if (value == current_room) {
                $('#channelList').append('<li id="' + value + '">' + value + '</li>');
            }
            else {
                $('#channelList').append('<li id="' + value + '"><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></li>');
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

