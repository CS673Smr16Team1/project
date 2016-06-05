
module.exports =
    function displayIssueLog(req, res){
        res.render('issueLogView', {title: 'Project (BUGS)- Issue Log', issueLogSelected: 'pure-menu-selected'});
    };

