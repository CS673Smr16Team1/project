var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function getMorePublicMessages(req, res){
        dbFunctions.getSenderReceiverIds([req.params.person1Id, req.params.person2Id], function(result) {
            dbFunctions.getMorePrivateMessages(result[0].idusers, result[1].idusers, req.params.messageId, function(result) {
                res.json(result);
            });
        });
    };
