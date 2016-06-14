
module.exports =
    function displayChatRoom(req, res){
        res.render('chatRoomView', {
          title: 'ChatNow | μProject',
          chatRoomSelected: 'pure-menu-selected',
          user: req.user,
          css: ['chat.css'],
          js: ['socket.io-1.2.0.js', 'chat.js', 'bootstrap.min.js']});
    };
