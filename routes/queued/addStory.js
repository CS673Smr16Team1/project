/**
 * Created by sangjoonlee on 2016-06-09.
 */

module.exports =
    function addStory(req , res , next){

        var projectId;
        projectId = req.params.projectId;

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        res.render('queuedStoryCreateView',
            {   title:"Queued | Add a Story | μProject",
                queuedSelected: 'active',
                projectId: projectId,
                js: ['clickActions.js'],
                user: req.user
            }
        );
    };
