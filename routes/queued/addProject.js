/**
 * Created by Juanito on 6/9/16.
 */
var dbFunctions = require('../../dbFunctions.js');
var _ = require('underscore');

module.exports =
    function addProject(req , res , next){
        dbFunctions.getUsernames(function(result) {
            var members = JSON.stringify(result);
            member_list = (_.pluck(result, 'username'));
            res.render('queuedAddProjectView', {
                title:"Queued | Add Project | μProject",
                queuedSelected: 'active',
                members: member_list,
                user: req.user,
                js: ['jquery-3.0.0.min.js', 'clickActions.js']
            });
            //console.log(member_list);
            //console.log(members);
        });

    };
