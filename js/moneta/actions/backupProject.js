

function backupProject(successCallback) {
	if (Ext.getCmp('win::backupProject')) {
		return Ext.getCmp('win::backupProject');
	}
	
	var win = Ext.create('Ext.window.Window', {id: 'win::backupProject', layout: 'fit', width: 400, height: 100, title: "Projects",});
	
	// Create the combo box, attached to the states data store
	var prjList = Ext.create('moneta.widgets.SmartComboBox', {
		id: 'id',
		name: 'id',
		allowBlank: false,
		forceSelection: true, // no custom values
		fields: ['id', 'name'],
		url: moneta.Globals.data.DATA_AVAILABLE_PROJECTS,
		hiddenName: 'hid',
		fieldLabel: 'Backup project',
		displayField: 'name',
		valueField: 'id',
		renderTo: Ext.getBody(),
		forceSelection: true
	});
	
	// The target URL
	var form = Ext.create('Ext.form.Panel', {
		bodyPadding: 5,
		width: 350,

		// The form will submit an AJAX request to this URL when submitted
		url: moneta.Globals.data.DATA_BACKUP_PROJECT,

		// Fields will be arranged vertically, stretched to full width
		layout: 'anchor',
		defaults: {
			anchor: '100%'
		},

		// The fields
		defaultType: 'textfield',
		items: [
			prjList,
			{
				xtype: 'hiddenfield',
				name: 'action',
				value: 'backup'
			}
		],

		// Reset and Submit buttons
		buttons: [{
			text: 'Submit',
			formBind: true, //only enabled once the form is valid
			disabled: true,
			handler: function() {
				var form = this.up('form').getForm();
				
				if (form.isValid()) {
					var exportApiUrl = form.url + '?';
					var fields = form.getFieldValues();
					for(param in fields) { exportApiUrl += '&' + param + '=' + fields[param]; }
					//window.open(exportApiUrl);
					
					var _downloadWin = new Ext.Window ({
					  height: 0, 
					  width: 0, 
					  title: 'External url', 
					  // the only load text will be in case of error otherwise the binary data will be downloaded.
					  html: '<iframe src="' + exportApiUrl + '" onload="moneta.Globals.handlers.checkAjaxResponse(this.contentDocument.body.innerText);"></iframe>'
					});
					// Does not really renders the window but simply invokes its internal url
					_downloadWin.doAutoRender();
					
					win.close();
				}
			}
		}],
		renderTo: Ext.getBody()
	});
	
	win.add(form);
    win.show();
}