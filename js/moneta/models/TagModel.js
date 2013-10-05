

Ext.Loader.setConfig({enabled: true});

/**
 * Model for TAGS
 */
Ext.define('moneta.model.Tag', {
	extend: 'Ext.data.Model',

	// For auto-generating form for new entries
	crud: {
		url: moneta.Globals.data.DATA_TAGS + '?',
		id: 'moneta.forms.NewTag',
		title: 'Insert New Tag',
	},
	
	idProperty: 'id',
	fields:[
		{name: 'id', type: 'number', 
			GridOptions: {
				skip: true,
			},
			FormOptions: {hidden: true, editor: {xtype: 'numberfield'}}
		},		
		{name: 'name', 
			type: 'string', 
			selectOnFocus: true,
			GridOptions: {text: "Label", editable: true, flex: 1},
			FormOptions: {fieldLabel: 'Label',allowBlank: false}
		}
	],
});