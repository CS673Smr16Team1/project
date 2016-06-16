
var connection =
    require('./../dbConnection.js').dbConnect();


module.exports =
    function displayIssueDetail(req, res){
        var id = req.params.id;

        connection.query({nestTables: true, sql: 'SELECT * FROM Issues' +
            ' inner join IssueImages on Issues.Id = IssueImages.IssueId' +
            ' WHERE (Issues.Id = ?)'},
            id,
            function(err,rows){
                console.log(rows);
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                var images = [];
                for(var i = 0; i < rows.length; i++) {
                    rows[i].IssueImages.ImageFilePath = rows[i].IssueImages.ImageFilePath.replace('public', '');
                    images.push(rows[i].IssueImages);
                }
                res.render('issueDetailView', {
                    title: 'Bugs - Issue Detail - #' + id + ' | μProject',
                    issueLogSelected: 'pure-menu-selected',
                    data: rows[0].Issues,
                    // need to iterate through the rows objects and grab all the images
                    // each row consists of 2 objects, Issues & Issue Images
                    images: images,
                    css: ['issue-detail.css'],
                    user: req.user});

            });
    };
