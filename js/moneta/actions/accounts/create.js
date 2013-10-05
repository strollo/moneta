
function createAccount(accountName) {
	if (!isProjectChoosen()) {
		showAvailableProjects();
		return;
	}


	var model = Ext.create('moneta.model.Account');
	
	// Init default values
	if (accountName) {
		try {
			model.fields.map['type'].value = accountName;
		} catch (e) {}
	}
	
	createForm(
		// ID
		'acct-new',
		// Title
		model.crud.title,
		// Model
		model,
		// URL
		model.crud.url,
		true, 
		// Component to refresh
		Ext.getCmp(moneta.Globals.id.UI_TREE_ACCOUNTS)
		).show();
}