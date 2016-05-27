var connection =
    require('./dbConnection.js').dbConnect();

module.exports =
    function displaySampleData(req, res) {
    var data = [
        {name: 'bob', age: 20},
        {name: 'sarah', age:30},
        {name: 'billy', age:40}
    ];

        connection.query('SELECT * FROM sample',
            function(err,rows){
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('sampleDataView', {title: 'Project - Sample Data',
                    sampleDataSelected: 'pure-menu-selected', myData: data, dbData: rows});
            });

    };


