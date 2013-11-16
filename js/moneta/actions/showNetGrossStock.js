
function showNetGrossStock(id, title) {
	if (!id) {
		id = 'stock-netgross-' + moneta.Globals.counters.ID_CHART++;
	}
	if (!title) {
		title = 'Net Gross';
	}
	if (!isProjectChoosen()) {
		showAvailableProjects(showNetGrossStock);
		return;
	}

	var _url = moneta.Globals.data.DATA_CHART + '?graphT=stocknetgross';
	c = Ext.create('moneta.widgets.HighStock', {url: _url, id: id, title: title, hideToolBar: true})
	c.loadData();
}