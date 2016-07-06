/**
 * Created by sangjoonlee on 2016-06-24.
 */

$(function() {
    $("#backlog_sortlist, #current_sortlist, #done_sortlist, #release_sortlist").sortable({
        connectWith: ".connectedSortable",
        update: function( event, ui ) {
            var order1 = $('#backlog_sortlist').sortable('toArray').toString();
            var order2 = $('#current_sortlist').sortable('toArray').toString();
            var order3 = $('#done_sortlist').sortable('toArray').toString();
            var order4 = $('#release_sortlist').sortable('toArray').toString();

            $.ajax({
                data: order1,
                url: '/queued-api/projectSaveOrder/' + order1 + '/' + 'Backlog'
            });
            $.ajax({
                data: order2,
                url: '/queued-api/projectSaveOrder/' + order2 + '/' + 'Current'
            });
            $.ajax({
                data: order3,
                url: '/queued-api/projectSaveOrder/' + order3 + '/' + 'Done'
            });
            $.ajax({
                data: order4,
                url: '/queued-api/projectSaveOrder/' + order4 + '/' + 'Release'
            });

        },
        //  stop: function( event, ui ) { alert('Stop!'); },
        dropOnEmpty: true
    }).disableSelection();
});
