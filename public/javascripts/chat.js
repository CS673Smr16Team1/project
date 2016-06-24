/**
 * Created by Chris on 6/11/2016.
 */
var socket = io();
var curRoom = "general";
var privateMessageRecipient = false;

function switchRoom(room) {
    window.curRoom = room;
    window.privateMessageRecipient = false;
    socket.emit('switchRoom', room);
}

function switchRoomPrivate(recipientUsername) {
    //window.curRoom = room;
    window.privateMessageRecipient = recipientUsername;
    socket.emit('switchRoomPrivate', recipientUsername);
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
            msg='[' + padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes()) + '] &lt' + username + '> ' + data;

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
                $('#channelList').append('<li id="' + value + '" role="presentation" class="active">#' + value + '</li>');
            }
            else {
                $('#channelList').append('<li id="' + value + '" role="presentation"><a href="#" onclick="switchRoom(\'' + value + '\')">#' + value + '</a></li>');
            }
        });

        if (privateMessageRecipient) {
            $("#currentChannel").text("@" + privateMessageRecipient);
        }
        else {
            $("#currentChannel").text("#" + current_room);
        }

    });

    socket.on('updateUsernames', function (usernames) {
        var userList = $('#userList');
        userList.empty();

        usernames.forEach(function (uName) {
            // don't include ourselves
            if(uName.username !== username) {
                userList.append('<li><button type="button" class="btn btn-default" data-toggle="modal" data-target="#directMessage" data-whatever="@'
                + uName.username +'">' + uName.username + '</button></li>');
            }
        });

        $("#userCount").text("Direct Message");

        userList.scrollTop(userList[0].scrollHeight - userList[0].clientHeight);
    });

    socket.on('onlinestatus', function(user, status) {
        console.log('hi');
        if(status==='online') {
            $('button[data-whatever="@' + user +'"]').css("background-color", "#0EDF12");
        }
        else {
            $('button[data-whatever="@' + user +'"]').css("background-color", "white");
        }
    });

    socket.on('refreshmessages', function(data) {
        var messages = $('#messages');
        messages.empty();
        var sender, msgTime, msg;
        $.each(data, function (key, value) {
            sender = value.username;
            var dt = new Date(value.message_date);
            msgTime = padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes());
            msg = value.message_content;

            messages.append($('<li>').html('[' + msgTime + '] &lt;' + sender + '> ' + multiLine(msg)));
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
        if(privateMessageRecipient) {
            socket.emit('sendChatPrivate', $('#chatInput').val(), privateMessageRecipient);
        }
        else {
            socket.emit('sendChatPublic', $('#chatInput').val());
        }

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
                        $('#createChannel').modal('hide');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log('ajax error:' + xhr.status + ' ' + thrownError);
                }
            });


        }

        return false;
    });

    $('#createChannel').on('hidden.bs.modal', function () {
        //erase error msg
        $('.modal-footer p').html('');
        //clear channel name
        $('#newChannelName').val('');
    });

    $('#createChannel').on('shown.bs.modal', function () {
        $('#newChannelName').focus();
    });

    // Bootstrap component
    /*$('#directMessage').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      modal.find('.modal-title').text('New message to ' + recipient)
      modal.find('.modal-body input').val(recipient)
    });*/

    $('body').on('click', '#userList li', function() {
       switchRoomPrivate($(this).text());
    });

});
