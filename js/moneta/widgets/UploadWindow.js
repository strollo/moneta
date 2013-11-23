Ext.require([
	'Ext.form.field.File',
	'Ext.form.Panel',
	'Ext.window.MessageBox'
]);


Ext.define('moneta.widgets.UploadWindow', {
	extend: 'moneta.widgets.ToggableWindow',
	xtype: 'upload-window',	
	layout: 'fit',
	autoDestroy: true,
	title: 'Restore project',
	id: moneta.Globals.id.UI_WIN_RESTORE,
	
	// The default initial configuration
	config: {
		renderTo: Ext.getBody(),		
		width: 300,
		//resizable: false,
	},
		
	showMsg: function(title, msg) {
		Ext.Msg.show({
			title: title,
			msg: msg,
			minWidth: 200,
			modal: true,
			icon: Ext.Msg.INFO,
			buttons: Ext.Msg.OK
		});
	},
	
	getForm: function() {
		return this.items.items[0];
	},

	buttons: [{
		text: 'Save',
		handler: function(){
			// moneta.Globals.id.UI_WIN_RESTORE
			var container = Ext.getCmp(moneta.Globals.id.UI_WIN_RESTORE);
			var form = container.getForm();
			
			if(form.isValid()){
				form.submit({
					//waitMsg: 'Uploading your data...',
					success: function(fp, o) {
						container.showMsg('Success', 'Processed file "' + o.result.file + '" on the server');
					},
					failure: function(form, action) {
						container.showMsg('Failed', action.result.msg);
					}
				});
			}
		}
	},
	/*
	{
		text: 'Reset',
		handler: function() {
			this.up('form').getForm().reset();
		}
	}
	*/
	],
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([Ext.apply(me.config, cfg)]);
		
		var form = Ext.create('Ext.form.Panel', {
			url: me.config.url,
			
			//layout: 'anchor',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},	
			defaults: {
				margins: '5 5 5 5',
				allowBlank: false,
			},
			items: 
			[
				{
					xtype: 'textfield',
					fieldLabel: 'Project Name',
					layout: 'fit',
					width: 'auto',
					name: 'prj-name'
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Host',
					layout: 'fit',
					width: 'auto',
					name: 'prj-host',
					value: '127.0.0.1',
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Port',
					layout: 'fit',
					width: 'auto',
					name: 'prj-port',
					value: '3306',
				},
				{
					xtype: 'textfield',
					fieldLabel: 'User',
					layout: 'fit',
					width: 'auto',
					name: 'prj-user'
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Password',
					layout: 'fit',
					width: 'auto',
					name: 'prj-pwd'
				},
				{
					xtype: 'filefield',
					id: 'form-file',
					layout: 'fit',
					width: 'auto',
					emptyText: 'Select a project',
					fieldLabel: 'Project',
					name: 'project-path',
					buttonText: '...',
					/*buttonConfig: {
						iconCls: 'upload-icon'
					},*/
				},
				{
					xtype: 'hiddenfield',
					name: 'action',
					value: 'restore'
				}
			], // endof panel items
		});
		me.add(form);
	}
});
