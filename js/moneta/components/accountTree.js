




/*********************************************************************
 * TREE PANEL
 *********************************************************************/
Ext.define('moneta.store.JSONStore', {
	extend: 'Ext.data.TreeStore',
	
	// Initial config
	config: {
		autoSync: true,
		autoLoad: true,
		proxy: {
			 type: 'jsonp'
		},
		root : { 
			expanded : true
		},
	},
	
	// Constructor
	constructor: function(url) {
		var me = this;
		me.config.proxy.url = url;
		me.callParent([Ext.apply(me.config)]);	
		moneta.Globals.fn.clog(this.$className + ' init: { url: [' + this.proxy.url + ']}');
	}
});

function getTreeSelectedItems() {
	try {
		return Ext.getCmp(moneta.Globals.id.UI_TREE_ACCOUNTS).selModel.selected;
	} catch (e) {
		return null;
	}
}

/*********************************************************************
 * MENU ACTIONS
 *********************************************************************/
var mnuAccounts = new Ext.menu.Menu({
	items: [
		{text: 'Add Account',
			listeners: { click: function(event, node, x, y){ 
				var selNodes = getTreeSelectedItems();
				var accountName = null;
				if (selNodes) {
					try {
						accountName = selNodes.get(0).raw.name;					
					} catch (e) {}
				}
				createAccount(accountName);
			}}
		},
	]
});	
 
var mnuAccount = new Ext.menu.Menu({
	items: [
		{text: 'Details',
			listeners: { click: function(event, node, x, y){ 
				try {
					var node = getTreeSelectedItems().get(0).raw;
					if (node) {
						showDetails(null, node.key, node.text);
					}
				} catch (e) {
					moneta.Globals.fn.clog(e);
				}
			}}
		},	
		'-',
		{text: 'Edit Account',
			listeners: { click: function(event, node, x, y){ 
				var selectedItem = getTreeSelectedItems().get(0);
				moneta.Globals.fn.log(this.text + " clicked (" + selectedItem.raw.type + ", " + selectedItem.raw.id + ")"); 
				editAccount(Ext.getCmp(moneta.Globals.id.UI_TREE_ACCOUNTS));
			}}
		},
		{text: 'Delete Account',
			listeners: { click: function(event, node, x, y){ 
				var selectedItem = getTreeSelectedItems().get(0);
				moneta.Globals.fn.log(this.text + " clicked (" + selectedItem.raw.type + ", " + selectedItem.raw.id + ")"); 
				deleteAccount(selectedItem);				
			}}
		},
	]
});	


var mnuActivityDetails = new Ext.menu.Menu({
	items: [
		{text: 'Details',
			iconCls: 'ico-accounts-details',
			listeners: { click: function(event, node, x, y){ 
				try {
					var node = getTreeSelectedItems().get(0).raw;
					if (node) {
						showDetails(node.activity_id, node.account_id, node.text);
					}
				} catch (e) {
					moneta.Globals.fn.clog(e);
				}
			}}
		}
	]
});


/*********************************************************************
 * ENDOF MENU ACTIONS
 *********************************************************************/

function handleContextMenu(grid, record, item, index, event) 
{
	x = event.browserEvent.clientX;
	y = event.browserEvent.clientY;
	if (record.raw && record.raw.type && record.raw.type == 'account') {
		mnuAccount.showAt([x, y]);
	} else if (record.raw && record.raw.type && record.raw.type == 'account-group') {
		mnuAccounts.showAt([x, y]);
	} else if (record.raw && record.raw.type && record.raw.type == 'activity-type') {
		mnuActivityDetails.showAt([x, y]);
	}				
} 

function createJSONTreePanel(rootLabel, storeURL) {
	moneta.Globals.fn.log('> moneta.widgets.TreePanel: [RUNNING]');

	var _treepanel;
	_treepanel = Ext.create('Ext.tree.Panel', {
			autoDestroy: true,
			viewConfig: {
				loadMask: true,
				forceFit:true,
				align:'stretch',
			},
	
			id: moneta.Globals.id.UI_TREE_ACCOUNTS,
			store: Ext.create('moneta.store.JSONStore', storeURL),
			rootVisible : false,
			frame: false,
			border: 0,
			root : {
				text : rootLabel,
				id : 'data'
			},
			useArrows : true,
			/* Appends the menu */
			listeners : {
				// To show the tooltips (field qtip)
				itemmouseenter: function(view, rec, item, index, e, eOpts){
					view.tip = Ext.create('Ext.tip.QuickTip', {
						target: view.el,
						delegate: view.itemSelector,
						trackMouse: false,
						renderTo: Ext.getBody(),
					});
				},
			
				render : function () {
					Ext.getBody().on("contextmenu", Ext.emptyFn, null, {
						preventDefault : true,
					});
				},
				itemcontextmenu: handleContextMenu,			
			}
	});
	_treepanel.on('beforedestroy', moneta.Globals.handlers.onDestroy);
	_treepanel.on('beforehide', moneta.Globals.handlers.onHide);
	return _treepanel;
}; // createJSONTreePanel


