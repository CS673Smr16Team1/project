/**
 * Created by sangjoonlee on 2016-06-09.
 */

module.exports =
    function addStory(req , res , next){

        var projectId;
        projectId = req.params.projectId;

        // #debug: printing projectId of the currently requested view
        console.log("projectId: %s",projectId);

        res.render('storyCreateView',
            {   title:"Queued - Add a Story | μProject",
                requirementsSelected: 'pure-menu-selected',
                projectId: projectId,
                user: req.user
            }
        );
    };
