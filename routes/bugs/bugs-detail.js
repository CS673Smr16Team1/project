/**
 * Created by jackie on 6/5/16.
 * This route will display the issue detail page
 * loading the information, screenshots, and comments
 */
var connection = require('./../dbConnection.js').dbConnect();

// remove duplicates from join
function isUniqueBugsId(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item.Id) ? false : (seen[item.Id] = true);
    });
}

module.exports =

    function displayBugsDetail(req, res){
        var id = req.params.id;

        connection.query({nestTables: true, sql: 'SELECT * FROM Issues' +
            ' left join IssueImages on Issues.Id = IssueImages.IssueId' +
            ' left join IssueComments on Issues.Id = IssueComments.IssueId' +
            ' WHERE (Issues.Id = ?)'}, id, function(err, rows) {
                connection.query('SELECT * FROM users', function (err, users) {
                    if(err) {
                        console.log("Error Selecting : %s ", err);
                    }
                    var images = [];
                    var comments = [];
                    for(var i = 0; i < rows.length; i++) {
                        // check if any images were returned before pushing data onto the array
                        if(rows[i].IssueImages.Id) {
                            rows[i].IssueImages.ImageFilePath = rows[i].IssueImages.ImageFilePath.replace('public', '');
                            images.push(rows[i].IssueImages);
                        }
                        // check if any comments were returned before pushing data onto the array
                        if(rows[i].IssueComments.Id) {
                            comments.push(rows[i].IssueComments);
                        }
                    }

                    images = isUniqueBugsId(images);
                    comments = isUniqueBugsId(comments);

                    res.render('bugsDetailView', {
                        title: 'Bugs - Issue Detail - #' + id + ' | μProject',
                        bugsSelected: 'active',
                        data: rows[0].Issues,
                        images: images,
                        users: users,
                        comments: comments,
                        css: ['issue-detail.css',
                              'bootstrap-markdown.css',
                              'queued-detail.css',
                              'issue-comment.css',
                              'magnific-popup.css'],
                        js: ['bootstrap-markdown.js',
                             'fileinput.js',
                             'issueImages.js',
                             'magnific-popup.js'],
                        user: req.user});
                });
            });
    };
