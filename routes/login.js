
module.exports =
    function login(req, res){
        res.render('loginView', {
          title: 'Login | μProject',
          user: req.user});
    };
