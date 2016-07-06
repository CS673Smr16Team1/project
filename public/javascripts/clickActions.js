/**
 * Created by Juanito on 6/9/16.
 */
function addProject(){
    window.location.href = '/queued/add';
}

// This is cancel Create Project
function cancelAdd(){
    window.location.href = '/queued';
}

function cancelCreateStory(){
    window.history.back();
}

function cancelEditStory(){
    window.location.reload(false);
}
