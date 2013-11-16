

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
	layout: 'fit',
	renderTo: 'main::center-body',
	
	toggle: function() {
		if (this.isVisible()) {
			this.hide();
		} else {
			this.show();
		}
	},
	
	listeners: {
		maximize: function(self, eOpts) {
			try {
				self.setY(self.container.getY());
			} catch (e) {}
			// The top Y is not considered when restoring the original position
			// on unminimize.
			self.restorePos[1] += self.container.getY();
			return false;
		},
	},
	
	statics: {
		exists: function (id) {
			return (Ext.getCmp(id) != null);
		},
		
		get: function (id) {
			return Ext.getCmp(id);
		},
		
		create: function (id, cfg) {
			win = Ext.getCmp(id);
			if (!win || win.isDestroyed) {
				moneta.Globals.fn.clog('Creating a new ToggableWindow: [' + id + ']');
				win = Ext.create('moneta.widgets.ToggableWindow', id, cfg);
				win.onInit();
				win.on('beforedestroy', moneta.Globals.handlers.onDestroy);

				// Forces the registration of component otherwise the further getCmp will fail.
				Ext.ComponentManager.register(win);
				//win.show();
				win.toggle();
				return Ext.get(id);
			} else {
				moneta.Globals.fn.clog('Recycling ToggableWindow: [' + id + ']');
			}
			return win;
		},
	},
	
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
		return true;
	},
});