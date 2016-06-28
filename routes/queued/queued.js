
var connection =
    require('./../dbConnection.js').dbConnect();


module.exports =
    function displayRequirements(req, res){
        connection.query('SELECT * FROM QueuedProjects',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('queuedView', {
                    title: 'Queued | μProject',
                    queuedSelected: 'active',
                    css: ['queued.css'],
                    js: ['clickActions.js'],
                    data: rows,
                    user: req.user});

            });
    };
