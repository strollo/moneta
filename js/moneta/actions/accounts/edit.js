
function editAccount(tree) {
	var model = Ext.create('moneta.model.Account');
	
	w = createEditForm('edt-acct', model, tree, tree.selModel.selected.get(0).raw);
	w.show();
}