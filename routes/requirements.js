
var connection =
    require('./dbConnection.js').dbConnect();


module.exports =
    function displayRequirements(req, res){
        connection.query('SELECT * FROM Projects',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('requirementsView', {
                    title: 'Project - Requirements',
                    requirementsSelected: 'pure-menu-selected',
                    data: rows,
                    user: req.user});

            });
    };

