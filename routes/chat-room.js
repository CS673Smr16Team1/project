
module.exports =
    function displayChatRoom(req, res){
        res.render('chatRoomView', {title: 'Project - Chat Room', chatRoomSelected: 'pure-menu-selected',
            user: req.user});
    };
