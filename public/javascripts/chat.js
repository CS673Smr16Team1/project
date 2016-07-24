/**
 * Created by Chris on 6/11/2016.
 */
var socket = io();
var curRoom = "general";
var privateMessageRecipient = false;
var lowestId = -1;
var tempDay, tempMonth, tempYear;

function switchRoom(room) {
    window.curRoom = room;
    window.privateMessageRecipient = false;
    window.lowestId = -1;
    socket.emit('switchRoom', room);
    $('#newMessageAlert').html('');
}

function switchRoomPrivate(recipientUsername) {
    //window.curRoom = room;
    window.privateMessageRecipient = recipientUsername;
    socket.emit('switchRoomPrivate', recipientUsername);
    $('#newMessageAlert').html('');
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

    /*socket.on('connect', function () {
        if(window.location.href.slice(-9)==='chat-room') {
            socket.emit('adduser', username);
        }
    });*/

    socket.on('updatechat', function (username, data, msgDate) {

        var messages = $('#messages');
        var msg='';
        if(msgDate) {
            var dt = new Date(msgDate);

            //check if today's date has already been displayed - if not, display it
            var monthDayYear = dt.getMonth() + 1 + '-' + dt.getDate() + '-' + dt.getFullYear();
            var exists = $("#messages li.textCenter:contains(" + monthDayYear + ")");
            if(!exists.html()) {
                messages.append($('<li class="textCenter bold">').html(monthDayYear));
            }

            msg='[' + padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes()) + ' (EST)] &lt' + username + '> ' + data;

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

    socket.on('updateUsernames', function (usernames, onlineUsers) {
        var userList = $('#userList');
        userList.empty();

        usernames.forEach(function (uName) {
            // don't include ourselves
            if(uName.username !== username) {
                userList.append('<li><button type="button" class="btn btn-default" data-toggle="modal" data-target="#directMessage" data-whatever="@'
                + uName.username +'">' + uName.username + '</button></li>');

                //check if this user is online, if so, make the button green to indicate online status
                if($.inArray(uName.username, onlineUsers) !==-1) {
                    console.log(onlineUsers);
                    $('button[data-whatever="@' + uName.username +'"]').css("background-color", "#0EDF12");
                }
            }
        });

        $("#userCount").text("Direct Message");

        userList.scrollTop(userList[0].scrollHeight - userList[0].clientHeight);
    });

    socket.on('onlinestatus', function(user, status) {
        //console.log('hi');
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
        var sender, msgTime, msg, day=-1;
        $.each(data.reverse(), function (key, value) {
            if(key === 0 ) {
                window.lowestId = value.id;
            }
            sender = value.username;
            var dt = new Date(value.message_date);
            if(day!==dt.getDate()) {
                day = dt.getDate();
                messages.append($('<li class="textCenter bold">').html(dt.getMonth() + 1 + '-' + dt.getDate() + '-' + dt.getFullYear()));
            }
            msgTime = padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes());
            msg = value.message_content;

            messages.append($('<li>').html('[' + msgTime + ' (EST)] &lt;' + sender + '> ' + multiLine(msg)));
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
        var chatInput = $('#chatInput');
        //check for empty message
        if(chatInput.val().length===0) return false;

        if(privateMessageRecipient) {
            socket.emit('sendChatPrivate', chatInput.val(), privateMessageRecipient);
        }
        else {
            socket.emit('sendChatPublic', chatInput.val());
        }

        chatInput.val('');
        return false;
    });

    $('#searchForm').submit(function () {
        var searchString = $('#searchInput').val();

        $.ajax({
            type: 'GET',
            url: '/chat-api/search-messages/' + searchString,
            success: function(data) {
                if(data.length) {
                    var h = '<thead>'
                        + '<tr>'
                        + '<th>User</th>'
                        + '<th>Date</th>'
                        + '<th>Message</th>'
                        + '<th>Channel</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>';

                    $.each(data, function (key, value) {
                        var dt = new Date(value.message_date);
                        var formattedDate=dt.getMonth() + 1 + '-' + dt.getDate() + '-' + dt.getFullYear() + ', ' + padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes());

                        h += '<tr>'
                            + '<td>' + value.username + '</td>'
                            + '<td>' + formattedDate + '</td>'
                            + '<td>' + multiLine(value.message_content) + '</td>'
                            + '<td>' + value.channel_name + '</td>'
                            +'</tr>';
                    });
                    h+= '</tbody>';
                    $('#searchResultsTable').html(h);
                }
                else {
                    $('#searchResultsTable').html('No Results');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('ajax error:' + xhr.status + ' ' + thrownError);
            }
        });
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

    $('.archiveForm').submit(function () {
        socket.emit('archiveChannel', $('#archiveChannelDropdown').val());
        $('#archiveChannel').modal('hide');
        return false;
    });

    $('.unarchiveForm').submit(function () {
        socket.emit('unarchiveChannel', $('#unarchiveChannelDropdown').val());
        $('#unarchiveChannel').modal('hide');
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

    $('body').on('click', '#userList li', function() {
       switchRoomPrivate($(this).text());
    });

    $('#archiveChannel').on('show.bs.modal', function() {
        $.ajax({
            type: 'GET',
            url: '/chat-api/archivable-channels',
            success: function(data) {
                if(data.length) {
                    var optionsHtml = '';
                    data.forEach(function(channel) {
                        optionsHtml+='<option value="' + channel.channel_name + '">' + channel.channel_name + '</option>';
                    });

                    $('#archiveChannelDropdown').html(optionsHtml);
                }
                else {
                    $('.archiveForm').html('There are no channels that can be archived.');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('ajax error:' + xhr.status + ' ' + thrownError);
            }
        });
    });

    $('#unarchiveChannel').on('show.bs.modal', function() {
        $.ajax({
            type: 'GET',
            url: '/chat-api/unarchivable-channels',
            success: function(data) {
                if(data.length) {
                    var optionsHtml = '';
                    data.forEach(function(channel) {
                        optionsHtml+='<option value="' + channel.channel_name + '">' + channel.channel_name + '</option>';
                    });

                    $('#unarchiveChannelDropdown').html(optionsHtml);
                }
                else {
                    $('.unarchiveForm').html('There are no channels that can be unarchived.');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('ajax error:' + xhr.status + ' ' + thrownError);
            }
        });
    });


    //infinite scroll (30 messages at once)

    $('#messages').scroll(function () {

        if ($(this).scrollTop() == 0) {

            var firstRow = $('#messages li').first();
            if ($(firstRow).hasClass("textCenter")) {
                //first row was a date row
                var tempDate = new Date($(firstRow).text());
                window.tempDay = tempDate.getDate();
                window.tempMonth = tempDate.getMonth() + 1;
                window.tempYear = tempDate.getFullYear();
            }
            var oldScrollHeight = $(this)[0].scrollHeight;

            var curChan = $('#currentChannel').text();
            if (curChan.substring(0, 1) === '#') { //public channel
                ajaxUrl = '/chat-api/more-public-messages/' + window.curRoom + '/' + window.lowestId;
            }
            else { //direct message
                ajaxUrl = '/chat-api/more-private-messages/' + username + '/' + curChan.substring(1, curChan.length) + '/' + window.lowestId;
            }

            $.ajax({
                type: 'GET',
                url: ajaxUrl,
                success: function (data) {
                    var messages = $('#messages');
                    var sender, msgTime, msg, day = tempDay;
                    var dt;
                    $.each(data, function (key, value) {
                        sender = value.username;
                        dt = new Date(value.message_date);

                        if (dt.getDate() == tempDay) {
                            $(firstRow).remove();
                        }

                        if (day !== dt.getDate()) {
                            messages.prepend($('<li class="textCenter bold">').html(window.tempMonth + '-' + window.tempDay + '-' + window.tempYear));
                            day = dt.getDate();
                            window.tempDay = day;
                            window.tempMonth = dt.getMonth() + 1;
                            window.tempYear = dt.getFullYear();
                        }
                        msgTime = padTimeWithZero(dt.getHours()) + ':' + padTimeWithZero(dt.getMinutes());
                        msg = value.message_content;

                        messages.prepend($('<li>').html('[' + msgTime + ' (EST)] &lt;' + sender + '> ' + multiLine(msg)));

                        window.lowestId = value.id;

                        var newScrollHeight = $('#messages')[0].scrollHeight;

                        $('#messages').scrollTop(newScrollHeight - oldScrollHeight);
                    });

                    if (data.length) {
                        messages.prepend($('<li class="textCenter bold">').html(dt.getMonth() + 1 + '-' + dt.getDate() + '-' + dt.getFullYear()));
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('ajax error:' + xhr.status + ' ' + thrownError);
                }
            });

        }

    });

});
