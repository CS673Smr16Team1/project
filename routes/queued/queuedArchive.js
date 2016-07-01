
var connection =
    require('./../dbConnection.js').dbConnect();


module.exports =
    function displayRequirements(req, res){
        connection.query('SELECT * FROM QueuedProjects WHERE archived =0',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('queuedArchiveView', {
                    title: 'Queued Archive| μProject',
                    queuedSelected: 'active',
                    css: ['queued.css'],
                    js: ['queued.js'],
                    data: rows,
                    user: req.user});

            });
    };
