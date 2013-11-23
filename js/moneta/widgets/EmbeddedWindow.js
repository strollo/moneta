/**
 * A simple Window extension that is designed to maximize inside a container.
 * Sample of instantiation: 
 * Ext.create('moneta.widgets.EmbeddedWindow', '<container ID>', {<custom configuration>});
 */
Ext.define('moneta.widgets.EmbeddedWindow', {
	extend: 'Ext.window.Window',
	xtype: 'embedded-window',	
	autoDestroy: true,

	// The default initial configuration
	config: {
		maximizable: true,
	},
	
	constructor: function(containerID, cfg) {
		var me = this;
		me.renderTo = containerID;
		me.callParent([Ext.apply(me.config, cfg)]);
		
		me.on('maximize', function(self, eOpts) {
				try {
					self.setY(self.container.getY());
				} catch (e) {}
				// The top Y is not considered when restoring the original position
				// on unminimize.
				self.restorePos[1] += self.container.getY();
				return false;
			}
		);
	}
});