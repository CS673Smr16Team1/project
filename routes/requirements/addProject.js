/**
 * Created by Juanito on 6/9/16.
 */
module.exports =
    function addProject(req , res , next){
        res.render('addProjectView', {
            title:"Queued - Add a Project | μProject",
            requirementsSelected: 'pure-menu-selected',
            user: req.user
        });
    };