


/**
 * Usage:
 * req = Ext.create('moneta.smart.SmartAjaxReq', {successHandler: function(req) {console.log('OK');}, url:_url});
 * req.load();
 */
Ext.define('moneta.smart.SmartAjaxReq', {
	onResponse: function(response) {
		res = Ext.JSON.decode(response.responseText);
		if (res.success == 'false' || res.error == 'true') {
		   Ext.MessageBox.show({
			   title: 'Error',
			   msg: res.msg,
			   buttons: Ext.MessageBox.OK,
			   icon: Ext.MessageBox.ERROR
		   });
		} else {
			var me = response.request.options.self;
			me.config.successHandler(me, response);
		}
	},

	load: function() {
		var me = this;
		Ext.Ajax.request({
			url: me.config.url,
			proxy: {
				type: 'jsonp',
				url: me.config.url,
				reader : {
					root : 'data',
					totalProperty : 'totalCount',
					successProperty : 'success'
				},
			},
			method: 'GET',
			self: me,
			success: me.onResponse,
		});
	},
	constructor: function(cfg) {
		var me = this;
		if (cfg == null) {
			throw 'Cannot create ' + me.name + ' with no configuration';
		}
		moneta.Globals.fn.checkParam(me, cfg, 'successHandler');
		moneta.Globals.fn.checkParam(me, cfg, 'url');
		moneta.Globals.fn.checkParam(me, cfg, 'id');
		me.config.self = me;
		me.callParent([Ext.apply(me.config, cfg)]);
	}
});