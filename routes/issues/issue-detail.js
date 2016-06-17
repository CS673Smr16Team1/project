/**
 * Created by jackie on 6/5/16.
 * This route will display the issue detail page
 * loading the information and screenshots
 */
var connection =
    require('./../dbConnection.js').dbConnect();


module.exports =
    function displayIssueDetail(req, res){
        var id = req.params.id;

        connection.query({nestTables: true, sql: 'SELECT * FROM Issues' +
            ' left join IssueImages on Issues.Id = IssueImages.IssueId' +
            ' WHERE (Issues.Id = ?)'},
            id,
            function(err,rows){
                console.log(rows);
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                var images = [];
                for(var i = 0; i < rows.length; i++) {
                    if(rows[i].IssueImages.Id) {
                        rows[i].IssueImages.ImageFilePath = rows[i].IssueImages.ImageFilePath.replace('public', '');
                        images.push(rows[i].IssueImages);
                    }
                }
                res.render('issueDetailView', {
                    title: 'Bugs - Issue Detail - #' + id + ' | μProject',
                    issueLogSelected: 'pure-menu-selected',
                    data: rows[0].Issues,
                    images: images,
                    css: ['issue-detail.css'],
                    js: ['issueImages.js'],
                    user: req.user});

            });
    };
