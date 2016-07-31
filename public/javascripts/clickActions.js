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
    form.target = '_self';
}

function AddMember(){


    //get new member value
    var value = document.getElementById("newMembers").value;

    var elementExists = document.getElementById(value);
    console.log(elementExists);
    console.log(!!elementExists);

    if(!!elementExists == false)
    {
        if(value == ""){
            var warningDiv = document.getElementById("warning");
            var str = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> <strong>Warning!</strong> Enter Valid User. </div>';
            warningDiv.innerHTML = str;

        }else {
            //create check box
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "members";
            checkbox.id = value;
            checkbox.value = value;
            checkbox.checked = true;

            var label = document.createElement('label')
            label.htmlFor = "id";

            label.appendChild(document.createTextNode(value));

            document.getElementById('project_members').appendChild(checkbox);
            document.getElementById('project_members').appendChild(label);

            var br = document.createElement('br');
            document.getElementById('project_members').appendChild(br);

        }
    }
    else{
        if(elementExists == null){
            var warningDiv = document.getElementById("warning");
            var str = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> <strong>Warning!</strong> Enter Valid User. </div>';
            warningDiv.innerHTML = str;

        }
        else{
            var warningDiv = document.getElementById("warning");
            var str = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> User already added to Project.</div>';
            warningDiv.innerHTML = str;

        }
    }
    document.getElementById('newMembers').value = "";
}