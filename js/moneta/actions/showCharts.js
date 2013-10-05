
function showCharts(id, title, activityType, groupBy, limit) {
	if (!id) {
		id = 'chart-' + moneta.Globals.counters.ID_CHART++;
	}
	if (!title) {
		title = 'Expenses <-> Tag';
	}
	if (!activityType) {
		activityType = 2;
	}
	if (!groupBy) {
		groupBy = 'tag';
	}
	if (!limit) {
		limit = 10;
	}

	if (!isProjectChoosen()) {
		showAvailableProjects();
		return;
	}

	var _url = moneta.Globals.data.DATA_CHART + '?activity_type=' + activityType + '&groupBy=' + groupBy + '&limit=' + limit;
	c = Ext.create('moneta.widgets.HighChart', {url: _url, id: id, title: title, type:'pie'})
	c.loadData();
}