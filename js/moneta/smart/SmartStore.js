
Ext.Loader.setConfig({
	enabled : true
});
Ext.require([
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.util.*',
		'Ext.toolbar.Paging',
		'Ext.ModelManager',
		'Ext.tip.QuickTipManager'
	]);

Ext.define('moneta.store.SmartStore', {
	extend : 'Ext.data.Store',
	// destroy the store if the grid is destroyed
	autoDestroy : true,
	autoSync : true,
	autoLoad: true,
	remoteSort:true,
	sortOnLoad : true,
	
	handleLoad: function (me, records, successful, eOpts) {
		console.log('[SmartStore] Grabbing store load');
	},
	handleUpdate: function ( me, record, operation, modifiedFieldNames, eOpts ) {
		console.log('[SmartStore] Grabbing update load');
	},
	handleWrite: function ( me, operation, eOpts ) {
		console.log('[SmartStore] Grabbing write');
	},
	handleSync: function ( options, eOpts ) {
		console.log('[SmartStore] Grabbing Sync');
	},
	
	constructor : function (_model, _target, rootNode, cfg) {
		var me = this;
		cfg = cfg || {};

		me.callParent([Ext.apply({
				autoLoad : true,
				model : _model,
				storeId : 'moneta.store.SmartStore',
				proxy : {
					type : 'jsonp',
					api : {
						create : _target + '&action=create',
						read : _target + '&action=read',
						update : _target + '&action=update',
						destroy : _target + '&action=destroy'
					},
					reader : {
						root : rootNode,
						totalProperty : 'totalCount',
						successProperty : 'success', // message for OK
					},
					writer : {
						root : rootNode,
						// non posso togliere questa
						type : 'json',
					},
				}
			}, cfg)]);
		
		me.on('load', me.handleLoad);
		me.on('update', me.handleUpdate);
		me.on('write', me.handleWrite);
		me.on('beforesync', me.handleSync);
	}
});