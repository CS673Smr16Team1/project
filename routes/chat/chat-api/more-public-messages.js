var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function getMorePublicMessages(req, res){
        dbFunctions.getMorePublicMessages(req.params.channelId, req.params.messageId, function(result) {
           res.json(result);
        });

    };
