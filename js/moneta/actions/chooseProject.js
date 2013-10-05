
function isProjectChoosen() {
	return (Ext.getCmp('moneta.label.currPrj') &&
			Ext.getCmp('moneta.label.currPrj').text != null && 
			Ext.getCmp('moneta.label.currPrj').text != '-');
}

function showAvailableProjects(parentMenu) {
	if (Ext.getCmp('win:projectlist')) {
		return Ext.getCmp('win:projectlist');
	}
	
	var win = Ext.create('Ext.window.Window', {id: 'win:projectlist', layout: 'fit', width: 400, height: 100, title: "Projects",});
	
	// Create the combo box, attached to the states data store
	var prjList = Ext.create('moneta.widgets.SmartComboBox', {
		id: 'chosenPrj',
		name: 'chosenPrj',
		allowBlank: false,
		forceSelection: true, // no custom values
		fields: ['id', 'name'],
		url: moneta.Globals.data.DATA_AVAILABLE_PROJECTS,
		hiddenName: 'hid',
		fieldLabel: 'Activate project',
		displayField: 'name',
		valueField: 'name',
		renderTo: Ext.getBody(),
		forceSelection: true
	});
	
	// The target URL
	var form = Ext.create('Ext.form.Panel', {
		bodyPadding: 5,
		width: 350,

		// The form will submit an AJAX request to this URL when submitted
		url: moneta.Globals.data.DATA_SET_CURRENT_PROJECT,

		// Fields will be arranged vertically, stretched to full width
		layout: 'anchor',
		defaults: {
			anchor: '100%'
		},

		// The fields
		defaultType: 'textfield',
		items: [prjList],

		// Reset and Submit buttons
		buttons: [{
			text: 'Submit',
			formBind: true, //only enabled once the form is valid
			disabled: true,
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
					form.submit({
						success: function(form, action) {
						   //Ext.Msg.alert('Success', action.result.msg);
						   // changes the label of current loaded project
						   Ext.getCmp('moneta.label.currPrj').setText(Ext.getCmp('chosenPrj').rawValue);
						   win.close();
						},
						failure: function(form, action) {
							Ext.Msg.alert('Failed', action.result.msg);
							win.close();
						}
					});
				}
			}
		}],
		renderTo: Ext.getBody()
	});
	
	win.add(form);
    win.show();
}