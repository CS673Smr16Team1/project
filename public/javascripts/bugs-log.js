$('document').ready(function () {
  $('#bugs-list').jplist({
    itemsBox:    '.bugs-items',
    itemPath:    '.bugs-list-item',
    panelPath:   '.bugs-list-panel',
    deepLinking: false
  });
});
