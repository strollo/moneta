
function menuContextMenu(grid, record, item, index, event) 
{
	if (record.data.leaf && record.raw.url) {
		var win = Ext.getCmp(moneta.Globals.id.UI_WIN_HELP);
		var helpPanel = win.getBodyPanel();
		helpPanel.setPageURL(record.raw.url);
	}
	console.log('XXX');		
}

function createHelpTreePanel(rootLabel, storeURL) {
	moneta.Globals.fn.log('> moneta.widgets.TreePanel: [RUNNING]');

	var _treepanel;
	_treepanel = Ext.create('Ext.tree.Panel', {
			autoDestroy: true,
			viewConfig: {
				loadMask: true,
				forceFit:true,
				align:'stretch',
			},
	
			id: 'help::tree',
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
				render : function () {
					Ext.getBody().on("contextmenu", Ext.emptyFn, null, {
						preventDefault : true,
					});
				},
				itemclick: menuContextMenu,			
			}
	});
	// Destroy the tooltip
	_treepanel.on('destroy', function( panel, eOpts ) { try { panel.tip.destroy(); } catch (e) {} });
	_treepanel.on('beforedestroy', moneta.Globals.handlers.onDestroy);
	_treepanel.on('beforehide', moneta.Globals.handlers.onHide);
	return _treepanel;
}; // createJSONTreePanel

function showHelp() {
	var win = moneta.widgets.ToggableWindow.create(
		// ID
		moneta.Globals.id.UI_WIN_HELP,
		// Config
		{
			width: 600,
			height: 500,
			title: 'Help',
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
					html : "The west side of the panel",
					id: 'help-west',
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
				   id: 'help-center',
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
				var content = Ext.getCmp('help-' + side);
				content.removeAll(true); 
				var container = content.add(component);
				content.doLayout();
				container.show(); 
			},	
			
			getBodyPanel: function() {
				return Ext.getCmp('help-body');
			},
			
			// On creation
			onInit: function () {
				var viewport = Ext.ComponentQuery.query('viewport')[0];
				this.width = viewport.width - 100;
				this.height = viewport.height - 100;
				
				var tree = createHelpTreePanel('data', 'php/help/getHelp.php');
				
				this.addComponent('west', tree);
				this.addComponent('center', Ext.create('HTMLPanel', {id: 'help-body', margin: 10, border: false, bodyBorder: false}));
			},
			


		}
	);
	
	if (win != null) {
		win.toggle();
	}
}