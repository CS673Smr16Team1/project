
module.exports =
    function displayChatRoom(req, res){
        res.render('chatRoomView', {
          title: 'ChatNow | μProject',
          user: req.user,
          chatnowSelected: 'active',
          css: ['chat.css', 'bootstrap-drawer.css'],
            js: ['chat.js', 'drawer.js']});
    };
