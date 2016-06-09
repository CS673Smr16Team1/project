/**
 * Created by Juanito on 6/9/16.
 */
module.exports =
    function addCourse(req , res , next){
        res.render('addProjectView',
            {title:"Add a Course"});
    };