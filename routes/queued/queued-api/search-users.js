/**
 * Created by Juanito on 6/29/16.
 */
var dbFunctions = require('../../../dbFunctions.js');
var dbFunctions = require('../../dbFunctions.js');
var _ = require('underscore');

dbFunctions.getUsernames(function(result) {
    var members = JSON.stringify(result);
    member_list = (_.pluck(result, 'username'));
    //console.log(member_list);
    //console.log(members);
});

module.exports =
    function updateEmailNotification(req, res){
        dbFunctions.userExists(req.user.username, function(result) {
            var id = result[0].idusers;
            dbFunctions.updateEmailNotification(req.params.setting, id);

        });
    };
