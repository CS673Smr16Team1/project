
module.exports =
    function login(req, res){
        res.render('settingsView', {
          title: 'Settings | μProject',
          settingsSelected: 'active',
          js: 'tab.js',
          user: req.user});
    };
