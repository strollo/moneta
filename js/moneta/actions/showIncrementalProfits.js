
function showIncrementalProfits(id, title) {
	if (!id) {
		id = 'stock-incrprofits-' + moneta.Globals.counters.ID_CHART++;
	}
	if (!title) {
		title = 'My growth';
	}
	if (!isProjectChoosen()) {
		showAvailableProjects(showIncrementalProfits);
		return;
	}

	var _url = moneta.Globals.data.DATA_CHART + '?graphT=incrementalprofits';
	c = Ext.create('moneta.widgets.HighStock', {url: _url, id: id, title: title, hideToolBar: true, incrementalMode: true})
	c.loadData();
}