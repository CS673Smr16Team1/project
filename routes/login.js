
module.exports =
    function login(req, res){
        res.render('loginView', {title: 'Project - Log In', user: req.user});
    };

