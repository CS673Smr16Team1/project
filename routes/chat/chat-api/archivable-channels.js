var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function archivableChannels(req, res){
        dbFunctions.getArchivableChannelList(function(results) {
           res.json(results);
        });

    };
