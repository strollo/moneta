
/*
 * HELPERS FOR WINDOW CREATION
 */
function showAccounts() {

	if (!isProjectChoosen()) {
		showAvailableProjects(showAccounts);
		return;
	}

	var win = moneta.widgets.ToggableWindow.create(
		// ID
		moneta.Globals.id.UI_WIN_ACCOUNTS,
		// Config
		{
			title: moneta.Globals.consts.WN_ACCOUNT_LABEL,
			maximizable : true,
			layout: {
				type: 'border',
				regionWeights: {
					/* if 0 the north is full span otherwise the west is full span */
					west: 0,
					north: 0,
					south: 1,
					east: 1
				}
			},
			items:[
				{
					// ToolBar
					html : "The north side of the panel",
					id: 'accounts::north',
					region : "north",
					split : true,
					height: 'auto',
					layout: 'fit',
					/* disabled */
					hidden: false,
					border: 0,
			   },
			   {
					html : "The west side of the panel",
					id: 'accounts::west',
					region : "west",
					width : 250,
					split : true,
					layout: 'fit',
					/* disabled */
					hidden: false,
					border: 0,
			   },
			   new Ext.Panel ({
				   region:'center',
				   id: 'accounts::center',
				   layout: 'fit',
				   border: 0,
			   })
			],
			
			/* 
			 * Sets the component on the center (main view)
			 */
			addComponent: function(side, component, label) {
				if (label != null) {
					component.title = label;
				}
				var content = Ext.getCmp('accounts::' + side);
				content.removeAll(true); 
				var container = content.add(component);
				content.doLayout();
				container.show(); 
			},	
			
			// On creation
			onInit: function () {
				// Creates the tree
				var tree = createJSONTreePanel(moneta.Globals.consts.WN_ACCOUNT_LABEL, moneta.Globals.data.DATA_ACCOUNTS);
				
				var viewport = Ext.ComponentQuery.query('viewport')[0];
				
				this.width = viewport.width - 100;
				this.height = viewport.height - 100;
				this.addComponent('west', tree, null);
				
				
				var toolbar = Ext.create('Ext.panel.Panel',
				{
					id: 'accounts::toolbar',
					baseCls: 'x-toolbar-default',
					border: false,
					items: [{
						xtype: 'button',
						text: 'Refresh',
						iconCls: 'ico-refresh',
						listeners: { 
							click: function(event, node, x, y) { 
								Ext.getCmp(moneta.Globals.id.UI_TREE_ACCOUNTS).store.reload();
							} 
						}
					}],
					log: function(txt) {
						_textbox = Ext.getCmp('main::statusbar::text');
						_textbox.setText(_textbox.text + "\n" + txt);
					},
				});
				
				this.addComponent('north', toolbar, null);
			}
		} // endof config
	);
	
	if (win != null) {
		win.toggle();
	}
}