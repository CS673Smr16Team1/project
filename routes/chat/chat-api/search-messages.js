var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function searchMessages(req, res){
        dbFunctions.userExists(req.user.username, function(idResult) {
           var id = idResult[0].idusers;
            dbFunctions.searchMessages(id, req.params.message, function(msgResults) {
                res.json(msgResults);
            });
        });

    };
