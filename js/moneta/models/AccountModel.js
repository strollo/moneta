

Ext.Loader.setConfig({enabled: true});

/**
 * Model for Accounts (banks, investments, ...)
 */
Ext.define('moneta.model.Account', {
	extend: 'Ext.data.Model',

	// For auto-generating form for new entries
	crud: {
		url: moneta.Globals.data.DATA_ACCOUNTS + '?',
		id: 'moneta.forms.NewAccount',
		title: 'Insert New Account',
	},
	
	idProperty: 'id',
	fields:[
		{name: 'id', type: 'number', 
			valuesFrom: 'key', // In editing mode the old value is taken from this field
			GridOptions: {
				skip: true,
			},
			FormOptions: {hidden: true, editor: {xtype: 'numberfield'}}
		},		
		{name: 'name', 
			type: 'string', 
			selectOnFocus: true,
			GridOptions: {text: "Account", width: 120, editable: true},
			FormOptions: {fieldLabel: 'Account',allowBlank: false}
		},
		{name: 'initial_balance', type: 'number',
			GridOptions: { width: 120, editable: true, editor: {xtype: 'numberfield'}},
			FormOptions: { fieldLabel: 'Initial Balance', allowBlank: false, value: '0', editor: {xtype: 'numberfield'}}
		}, 
		{name: 'type', type: 'string',
			valuesFrom: 'group_id',
			Defaults: {
				text: 'Type',
				fieldLabel: 'Type',
				editor: {
					xtype: 'smartcombobox',
					url: moneta.Globals.lists.LIST_ACCOUNT_TYPES,
					fields: ['id','name'],
					valueField: 'id',
   	  	            displayField: 'name',
					multiSelect: false,
				}
			},
			GridOptions: {
				width: 320, align: 'left', sortable: true, flex: 1,
			},
			FormOptions: {
				allowBlank: false
			}
		}
	],
});