Ext.Loader.setConfig({enabled: true});

function showDuplicates() {
	if (!isProjectChoosen()) {
		showAvailableProjects(showDuplicates);
		return;
	}

	var container = Ext.create('Ext.window.Window', {
		title: 'Duplicates',
		width: 600,
		minHeight: 400,
		layout: 'fit',
		resizable: true,
		autoScroll: true,
		renderTo: Ext.getBody(),
	});

	// The target URL
	var url = moneta.Globals.data.DATA_DUPLICATES + '?';
	// The store
	var gridStore = Ext.create('moneta.store.SmartStore', 'moneta.model.Entry', url, 'data');
	// The grid
	var grid = Ext.create('moneta.widgets.SmartGrid', {
		model: 'moneta.model.Entry',
		enableEdit: false,
		enableExternalEdit: false,
		frame: false,
		border: 0,
		store: gridStore,
		// title: 'Duplicates'
	});
	grid.closable = true;
	container.add(grid);
	container.show();
};