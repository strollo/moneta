
function showUsers() {
	// The target URL
	var url = moneta.Globals.data.DATA_USERS + '?';
	// The store
	var gridStore = Ext.create('moneta.store.SmartStore', 'moneta.model.User', url, 'data');
	// The grid
	var grid = Ext.create('moneta.widgets.SmartGrid', {
		model: 'moneta.model.User',
		enableEdit: false,
		enableGrouping: false,
		enablePaging: false,
		enableCRUD: true,
		store: gridStore,
	});
	var win = moneta.widgets.ToggableWindow.create(
		// ID
		moneta.Globals.id.UI_WIN_USERS,
		// Config
		{ 
			layout: 'fit', 
			width: 400, 
			height: 400, 
			title: "Users",
			onInit: function () {
				this.add(grid);
			}
		}
	);
    if (win != null) {
		win.toggle();
	}
};