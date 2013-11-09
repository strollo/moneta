
function showStocks(id, title, activityType) {
	if (!id) {
		id = 'stock-' + moneta.Globals.counters.ID_CHART++;
	}
	if (!title) {
		title = 'Expenses';
	}
	if (!activityType) {
		activityType = 2;
	}

	if (!isProjectChoosen()) {
		showAvailableProjects(showStocks);
		return;
	}

	var _url = moneta.Globals.data.DATA_CHART + '?graphT=stock&activity_type=' + activityType;
	c = Ext.create('moneta.widgets.HighStock', {url: _url, id: id, title: title, type:'pie'})
	c.loadData();
}