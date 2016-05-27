
module.exports =
    function displayChatRoom(req, res){
        res.render('chatRoomView', {title: 'Project - Chat ROom', chatRoomSelected: 'pure-menu-selected'});
    };

