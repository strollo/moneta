
Ext.Loader.setConfig({enabled: true});
	
/**
 * Usage:
 * editor: {
 *		xtype: 'smartcombobox',
 *		fields: ['id','name'],
 *		url: THEURL,
 *		valueField: 'id',
 *		displayField: 'name',
 *		multiSelect: true
 * 		// ....
 * }
 */
Ext.define('moneta.widgets.SmartComboBox', {
	extend: 'Ext.form.field.ComboBox',
	
	xtype: 'smartcombobox',
	
	viewConfig: {
		loadMask: true,
	},
		
	constructor: function(cfg) {
		var me = this;
				
		/* INITIAL PARAMETER CHECKS */
		if (!cfg) {
			moneta.Globals.fn.clog('SmartComboBox: [ERR] no cfg property specified');
			return;
		}
		if (!cfg.hasOwnProperty('fields')) {
			moneta.Globals.fn.clog('SmartComboBox: [ERR] no cfg.fields property specified');
			return;
		}
		if (!cfg.hasOwnProperty('url')) {
			moneta.Globals.fn.clog('SmartComboBox: [ERR] no cfg.url property specified');
			return;
		}
		if (!cfg.hasOwnProperty('jsonID')) {
			moneta.Globals.fn.clog('SmartComboBox: [WARN] no jsonID property specified using default [' + cfg.fields[0] + ']');
		}
		if (!cfg.hasOwnProperty('jsonRoot')) {
			moneta.Globals.fn.clog('SmartComboBox: [WARN] no jsonRoot property specified using default [data]');
		}
		if (!cfg.hasOwnProperty('totalCount')) {
			moneta.Globals.fn.clog('SmartComboBox: [WARN] no totalCount property specified using default');
		}
		
		/* BUILDING STORE */
		moneta.Globals.fn.clog('SmartComboBox: creating store');
		me.config = cfg;
		me.config.store = new Ext.data.JsonStore({
			autoLoad: true,
			fields: cfg.fields,
			proxy: {
				type: 'jsonp',
				url: cfg.url + '?action=read',
				reader: {
					root: cfg.jsonRoot || 'data',
					totalProperty: cfg.totalCount || 'totalCount',				
					idProperty: cfg.jsonID || cfg.fields[0],
				},
			},
		});
		/* Checking default conf */
		if (!me.config.valueField) {
			me.config.valueField = cfg.fields[0];
		}
		if (!me.config.displayField) {
			me.config.displayField = cfg.fields[1];
		}
		/* autocompletion from second char */
		if (!cfg.hasOwnProperty('typeAhead')) {
			me.config.typeAhead = true;
		}
		if (!cfg.hasOwnProperty('minChars')) {
			me.config.minChars = 2;
		}
		
		me.callParent([Ext.apply(me.config)]);
	}
});