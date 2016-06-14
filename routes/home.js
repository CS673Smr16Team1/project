
module.exports =
    function displayHomePage(req, res){
        res.render('homeView', {
            title: 'μProject | A Tiny Project Management Service',
            homeSelected: 'pure-menu-selected',
            user: req.user,
            css: ['homepage.css']});
    };
