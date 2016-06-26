/**
 * Created by sangjoonlee on 2016-06-24.
 */

$(function() {
    $("#backlog_sortlist, #current_sortlist, #done_sortlist, #release_sortlist").sortable({
        connectWith: ".connectedSortable",
        update: function() {
            var order1 = $('#backlog_sortlist').sortable('toArray').toString();
            var order2 = $('#current_sortlist').sortable('toArray').toString();
            var order3 = $('#done_sortlist').sortable('toArray').toString();
            var order4 = $('#release_sortlist').sortable('toArray').toString();
            
        },
        dropOnEmpty: true
    }).disableSelection();
});
