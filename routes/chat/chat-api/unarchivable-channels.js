var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function unarchivableChannels(req, res){
        dbFunctions.getUnarchivableChannelList(function(results) {
           res.json(results);
        });

    };
