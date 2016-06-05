
module.exports =
    function displayHomePage(req, res){
        res.render('homeView', {title: 'Project - Home', homeSelected: 'pure-menu-selected',
        user: req.user});
    };

