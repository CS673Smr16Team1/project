
module.exports =
    function displayChatRoom(req, res){
        res.render('chatRoomView', {
          title: 'ChatNow | μProject',
          user: req.user,
          chatnowSelected: 'active',
          css: ['chat.css', 'bootstrap-drawer.css'],
          js: ['socket.io-1.2.0.js', 'chat.js', 'drawer.js']});
    };
