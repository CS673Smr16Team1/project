
var connection =
    require('./dbConnection.js').dbConnect();


module.exports =
    function displayRequirements(req, res){
        connection.query('SELECT * FROM QueuedProjects',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('requirementsView', {
                    title: 'Queued | μProject',
                    queuedSelected: 'active',
                    data: rows,
                    user: req.user});

            });
    };
