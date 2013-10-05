
Ext.define('moneta.widgets.StatusBar', {
	extend : 'Ext.panel.Panel',
	xtype : 'moneta-statusbar',	
	//updateEl: true,
	id: 'main::statusbar',
    renderTo: Ext.getBody(),
	autoScroll: true,
	tools: [
		{ 
			type: 'cancel',
			tooltip: 'Clear',
			handler: function(e, toolEl, panel, tc){
				_textbox = Ext.getCmp('main::statusbar::text');
				_textbox.setText("  ");
			}
		}
	],
	items: [{
		xtype: 'text',
		text: 'Welcome to Moneta',
		id: 'main::statusbar::text',
	}],
	log: function(txt) {
		_textbox = Ext.getCmp('main::statusbar::text');
		_textbox.setText(_textbox.text + "\n" + txt);
	},
	afterRender: function () {
        var me = this;
        me.callParent();
		
		// applies custom style for menubar of statusbar
		if (me.header && me.header.hasCls('x-panel-header-default')) {
			me.header.removeCls('x-panel-header-default');
			me.header.addCls('x-panel-header-custom');
		}
    }
});

function createStatusBar() {
	_retval = Ext.create('moneta.widgets.StatusBar');
	return _retval;
}