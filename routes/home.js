var util = require('util');

module.exports =
    function displayHomePage(req, res){
        res.render('homeView', {
            title: 'μProject | A Tiny Project Management Service',
            homeSelected: 'active',
            user: req.user});
    };
