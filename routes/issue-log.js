
module.exports =
    function displayIssueLog(req, res){
        res.render('issueLogView', {title: 'Project - Issue Log', issueLogSelected: 'pure-menu-selected',
            user: req.user});
    };

