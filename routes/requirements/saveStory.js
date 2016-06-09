/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function saveStory(req , res , next){

        var id = req.params.id;

        var inputFromForm = {
            storyId: id,
            projectId: 1,
            title: req.body.title,
            description: req.body.description,
            story_status: req.body.status,
            assignee: req.user.username,
            priority: req.body.priority
        };
        connection.query("INSERT INTO Story set ?",
            inputFromForm,
            function(err, rows)
            {
                if (err)
                    console.log("Error inserting Story: %s ",err );
                res.render('projectView', {
                    data: rows,
                    user: req.user});

            });
    };