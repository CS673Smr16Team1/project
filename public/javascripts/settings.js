/**
 * Created by Chris on 6/23/2016.
 */
$(document).ready(function() {
    $("[name='email-notif-checkbox']").bootstrapSwitch();

    $('input[name="email-notif-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var setting = state ? 1 : 0;
        $.ajax({
            type: 'POST',
            url: '/chat-api/update-email-notification/' + setting,
            success: function() {
                //console.log('success');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('ajax error:' + xhr.status + ' ' + thrownError);
            }
        });
    });
});

$(document).ready(function() {
    $("[name='queued-email-notif-checkbox']").bootstrapSwitch();

    $('input[name="queued-email-notif-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var setting = state ? 1 : 0;
        $.ajax({
            type: 'POST',
            url: '/queued-api/update-email-notification/' + setting,
            success: function() {
                //console.log('success');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('ajax error:' + xhr.status + ' ' + thrownError);
            }
        });
    });
});