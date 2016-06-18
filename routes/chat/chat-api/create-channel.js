var dbFunctions = require('../../../dbFunctions.js');

module.exports =
    function createChannel(req, res){
        dbFunctions.channelExists(req.params.channelName, function(result) {
            if(result.length > 0) {
                res.json([
                    {
                        exists: true
                    }
                ])
            }
            else {
                // insert new channel name into db
                dbFunctions.createChannel(req.params.channelName);

                res.json([
                    {
                        exists: false
                    }
                ])
            }
        });
    };
