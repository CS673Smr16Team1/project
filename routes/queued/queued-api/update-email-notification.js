var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function updateEmailNotification(req, res){
        dbFunctions.userExists(req.user.username, function(result) {
            var id = result[0].idusers;
            dbFunctions.updateQueuedEmailNotification(req.params.setting, id);

        });
    };
