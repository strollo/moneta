

/*
 * Custom window that supports toggle.
 * It will show/hide.
 * Do not create it explicitely but use 
 * moneta.widgets.ToggableWindow.create(...) function instead.
 * moneta.widgets.ToggableWindow.toggle() in place of show.
 * Usage:
 * 		win = moneta.widgets.ToggableWindow.create(
 *			// ID
 *			moneta.Globals.id.UI_WIN_USERS,
 *			// Config
 *			{ 
 *				layout: 'fit', 
 *				width: 400, 
 *				height: 400, 
 *	 			title: "Users",
 *				// That to do when CREATED
 *				onInit: function () {
 *					this.add(grid);
 *				}
 *			}
 *		);
 * 		win.toggle();
 */
Ext.define("moneta.widgets.ToggableWindow",
{
	extend: 'Ext.window.Window', 
	height: 400,
	//width: 600,
	layout: 'fit',
	//renderTo: 'main::center',
	
	// INIT
	constructor : function (_ID, cfg) {
		moneta.Globals.fn.log('Building a new window ID [' + _ID + ']');
		var me = this;
		me.callParent([Ext.apply(cfg)]);
		
		me.id = _ID;
	},
	
	// It must be inherited to apply logics on initilization
	// just the first time.
	onInit: function () {},
	
	onDestroy: function () {
		moneta.Globals.fn.clog('Destroying ToggableWindow: [' + this.id + ']');
		this.hide();
		return false;
	},
});

moneta.widgets.ToggableWindow.exists = function (id) {
	return (Ext.getCmp(id) != null);
};

moneta.widgets.ToggableWindow.get = function (id) {
	return Ext.getCmp(id);
};

moneta.widgets.ToggableWindow.create = function (id, cfg) {
	win = Ext.get(id);
	if (!win) {
		moneta.Globals.fn.clog('Creating a new ToggableWindow: [' + id + ']');
		win = Ext.create('moneta.widgets.ToggableWindow', id, cfg);
		win.onInit();
		win.on('beforedestroy', moneta.Globals.handlers.onDestroy);

		// Forces the registration of component otherwise the further getCmp will fail.
		Ext.ComponentManager.register(win);
		win.show();
		Ext.get(id).toggle();
		return Ext.get(id);
	} else {
		moneta.Globals.fn.clog('Recycling ToggableWindow: [' + id + ']');
	}
	return win;
};