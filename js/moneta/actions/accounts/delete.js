
function applyDelete(account) {
	Ext.Ajax.request({
		url: moneta.Globals.data.DATA_ACCOUNTS,
		method: 'GET',
		params: {
			action: 'destroy',
			records: [
				// From Object to Json String representation
				Ext.JSON.encode(account.raw)
			]
		},
		success: function(response){
			// Realods the tree
			Ext.getCmp(moneta.Globals.id.UI_TREE_ACCOUNTS).store.reload();
			moneta.Globals.handlers.checkAjaxResponse(response);
		},
	});
}

function deleteAccount(account) {
	moneta.Globals.fn.log("Deleting account (" + account.raw.key + "): " + account.raw.name); 
	account.raw.id = account.raw.key;
	Ext.Msg.show({
		 title:'Delete Account(s)?',
		 msg: 'Are you sure?',
		 buttons: Ext.Msg.OKCANCEL,
		 icon: Ext.Msg.QUESTION,
		 fn: function(btn, text){
			if (btn == 'ok'){
				applyDelete(account);
			}
		}
	});	
}