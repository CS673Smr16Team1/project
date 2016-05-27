
module.exports =
    function displayRequirements(req, res){
        res.render('requirementsView', {title: 'Project - Requirements', requirementsSelected: 'pure-menu-selected'});
    };

