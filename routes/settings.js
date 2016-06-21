
module.exports =
    function login(req, res){
        res.render('settingsView', {
          title: 'Settings | μProject',
          user: req.user});
    };
