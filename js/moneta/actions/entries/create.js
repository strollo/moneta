function createEntry() {
	if (!isProjectChoosen()) {
		showAvailableProjects();
		return;
	}

	var _m = Ext.create('moneta.model.Entry');
	var crud = _m.crud;
	createForm(
		// ID
		crud.id,
		// Title
		crud.title || 'Insert new elem',
		// Model
		_m.modelName,
		// URL
		crud.url,
		true).show();
}