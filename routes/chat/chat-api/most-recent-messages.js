var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function mostRecentMessages(req, res){
        dbFunctions.userExists(req.user.username, function(idResult) {
           var id = idResult[0].idusers;
            dbFunctions.mostRecentMessages(id, function(msgResults) {
                res.json(msgResults);
            });
        });

    };
