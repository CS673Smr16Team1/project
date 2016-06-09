/**
 * Created by sangjoonlee on 2016-06-09.
 */

module.exports =
    function addStory(req , res , next){
        res.render('storyCreateView',
            {title:"Add a Story"});
    };