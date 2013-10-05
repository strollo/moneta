

Ext.define("moneta.app.Application",
	{
		requires: ["Ext.draw.Color", "Ext.chart.theme.Theme", "moneta.Globals.id", "moneta.Globals.fn", "moneta.Globals.widgets", "moneta.widgets.MainMenu"],
		extend: "Ext.container.Viewport",
		id: moneta.Globals.id.UI_APPLICATION,
		width: 500,
		height: 400,
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
		/* DEFAULTS:
		 * the default xtype to assign to items when not specified.
		 */
		defaults: {
			xtype : "panel"
		},
		
		items : [
			{
				region : "north",
				height: 'auto',
				id: 'main::north',
				collapsible : false,
				split : false,
				height: 'auto',
			},
			{
				title : "West",
				html : "The west side of the panel",
				id: 'main::west',
				region : "west",
				width : 150,
				collapsible : true,
				split : true,
				/* disabled */
				hidden: true
			},
			{
				title : "East",
				html : "The east side of the panel",
				id: 'main::east',
				region : "east",
				width : 100,
				split : true,
				/* disabled */
				hidden: true,
			},
			{
				id: 'main::center',
				region : "center",
				layout: 'fit',
			},
			{
				height: 100,
				collapsible : true,
				resizable: true,
				title: 'Info',
				collapsed: true,
				id: 'main::south',
				html : "The south side of the panel!",
				region : "south",
				split : false,
				layout: 'fit',
			}
		],
		
		/* 
		 * Sets the component on the top (usually a menu)
		 */
		addComponent: function(label, component, position) {
			if (label != null) {
				component.title = label;
			}
			var content = Ext.getCmp('main::' + position);
			content.html = null;
			content.removeAll(true); 
			var container = content.add(component);
			content.doLayout();
			container.show(); 
		},
	}
);





