/**
 * Created by jackie on 6/5/16.
 * This route will display the issue detail page
 * loading the information, screenshots, and comments
 */
var connection = require('./../dbConnection.js').dbConnect();

// remove duplicates from join
function isUniqueIssueId(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item.Id) ? false : (seen[item.Id] = true);
    });
}

module.exports =
    function displayIssueDetail(req, res){
        var id = req.params.id;

        connection.query({nestTables: true, sql: 'SELECT * FROM Issues' +
            ' left join IssueImages on Issues.Id = IssueImages.IssueId' +
            ' left join IssueComments on Issues.Id = IssueComments.IssueId' +
            ' WHERE (Issues.Id = ?)'},
            id,
            function(err,rows){
                console.log(rows);
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

                images = isUniqueIssueId(images);
                comments = isUniqueIssueId(comments);

                //make an object to keep track of issue IDs ive mouseenter
                //check to see if that object, if youve seen it already
                res.render('bugsDetailView', {
                    title: 'Bugs - Issue Detail - #' + id + ' | μProject',
                    bugsSelected: 'active',
                    data: rows[0].Issues,
                    images: images,
                    comments: comments,
                    css: ['issue-detail.css', 'issue-comment.css'],
                    js: ['issueImages.js'],
                    user: req.user});

            });
    };
