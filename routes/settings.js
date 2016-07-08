var dbFunctions = require('../dbFunctions.js');
module.exports =
    function settings(req, res) {

        // check the state of the user's email notifications
        dbFunctions.getEmailNotificationStatusFromUsername(req.user.username, function(result) {
            res.render('settingsView', {
                title: 'Settings | μProject',
                settingsSelected: 'active',
                css: ['bootstrap-switch.min.css', 'settings.css'],
                js: ['tab.js', 'bootstrap-switch.min.js', 'settings.js'],
                user: req.user,
                emailNotificationState: result[0].email_notification,
                queuedEmailNotificationState: result[0].queued_email_notification
            });
        });



    };
