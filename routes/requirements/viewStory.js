/**
 * Created by sangjoonlee on 2016-06-11.
 */

// connect to DB
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function viewStory(req , res , next){

        var storyId = req.params.storyId;

        connection.query('SELECT * FROM QueuedStory WHERE storyId = ?',
            storyId,
            function(err,rows){
                console.log(rows);
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }

                res.render('storyView', {
                    title: 'Queued - Story Detail - #' + storyId + ' | μProject',
                    queuedSelected: 'active',
                    js: ['clickActions.js'],
                    data: rows[0],
                    user: req.user});

            });

    };
