
function showTags() {
	// The target URL
	var url = moneta.Globals.data.DATA_TAGS + '?';
	// The store
	var gridStore = Ext.create('moneta.store.SmartStore', 'moneta.model.Tag', url, 'data');
	// The grid
	var grid = Ext.create('moneta.widgets.SmartGrid', {
		model: 'moneta.model.Tag',
		enableEdit: false,
		enableGrouping: false,
		enablePaging: false,
		enableCRUD: true,
		store: gridStore,
	});
	var win = moneta.widgets.ToggableWindow.create(
		// ID
		moneta.Globals.id.UI_WIN_TAGS,
		// Config
		{ 
			layout: 'fit', 
			width: 400, 
			height: 400, 
			title: "Tags",
			onInit: function () {
				this.add(grid);
			}
		}
	);
    if (win != null) {
		win.toggle();
	}
};