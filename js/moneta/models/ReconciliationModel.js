

Ext.Loader.setConfig({enabled: true});


/**
 * Model for Entries (expenses, incomes, transfers...)
 */
Ext.define('moneta.model.Reconciliation', {
	extend: 'Ext.data.Model',

	id: 'moneta.model.Reconciliation',
	
	// For auto-generating form for new entries
	crud: {
		url: moneta.Globals.data.DATA_ENTRY_DETAILS + '?',
		id: 'moneta.forms.NewReconciliation',
		title: 'Insert New Reconciliation',
	},
	
	fields:[
		/*
		 * Internal fields that are used to manage data and are not required to the user
		 */
		{name: 'from', Defaults: {skip: true}},
		{name: 'to', Defaults: {skip: true}},
		{name: 'type', Defaults: {skip: true}},
		{name: 'id', type: 'int', GridOptions: {skip: true}, FormOptions: {hidden: true, editor: {xtype: 'numberfield'}}},
		
		/* FIELD: Date */
		{name: 'date', type: 'date',
			// Options for the smart grid
			Defaults: { editor: { xtype: 'datefield', allowBlank: true, format: 'd/m/Y', }, value: new Date(), },
			GridOptions: { text: "Date", width: 80,  align: 'left',  sortable: true, renderer: Ext.util.Format.dateRenderer('d/m/Y')},
			FormOptions: { fieldLabel: 'Date', allowBlank: false }
		},	
		/* FIELD: Type */
		{name: 'type_v', 
			valuesFrom: 'type', // In editing mode the old value is taken from this field
			Defaults: {
				editor: {
					id: 'moneta.forms.field.type',
					xtype: 'smartcombobox',
					fields: ['id','name'], 
					url: moneta.Globals.lists.LIST_ACTIVITY_TYPES, 
					valueField: 'id', 
					displayField: 'name',
				},
			},		
			GridOptions: {
				text: "Type", 
				width: 170, 
				align: 'left', 
				sortable: true, 
				flex: 1,
				// Custom renderer
				renderer: function(value, p, r) {
					return Ext.String.format('<b>{0}</b>', ((r.data.hasOwnProperty('type_v') && r.data['type_v'] != null) ? r.data['type_v'] : r.data['type']));
				}
			}, // endof smartgrid
			FormOptions: {
				fieldLabel: 'Type',
			}
		},		
		/* FIELD: Source */
		{name: 'from_v', 
			valuesFrom: 'from',
			Defaults: {
				editor: {
					id: 'moneta.forms.field.from',
					xtype: 'smartcombobox',
					fields: ['id','name'], 
					url: moneta.Globals.lists.LIST_ALLOWED_ACCTS, 
					valueField: 'id', 
					displayField: 'name'
				},
			},			
			GridOptions: {
				text: "Source", 
				width: 170, 
				align: 'left', 
				sortable: true, 
				flex: 1,
				// Custom renderer
				renderer: function(value, p, r) {
					return Ext.String.format('<b>{0}</b>', ((r.data.hasOwnProperty('from_v') && r.data['from_v'] != null) ? r.data['from_v'] : r.data['from']));
				}
			}, // endof smartgrid
			FormOptions: {
				fieldLabel: 'Source',
			}
		},		
		/* FIELD: Target */
		{name: 'to_v', type: 'string', 			
			valuesFrom: 'to',
			Defaults: {
				editor: {
					id: 'moneta.forms.field.to',
					xtype: 'smartcombobox',
					fields: ['id','name'], 
					url: moneta.Globals.lists.LIST_ALLOWED_ACCTS, 
					valueField: 'id', 
					displayField: 'name'
				},
			},
			GridOptions: {
				text: "Target", 
			},
			FormOptions: {
				fieldLabel: 'Target',
			}
		},	
		/* FIELD: Amount */
		{name: 'amount', type: 'floatOrString',  
			GridOptions: {
				text: "Amount", width: 70, align: 'left', sortable: true, editor: 'textfield',				
			}, // endof smartgrid			
			FormOptions: {
				value: 0,
				fieldLabel: "Amount",
				editor: {
					xtype: 'numberfield',
					step: 10,
				}
			}
		},
		/* FIELD: Tag */
		{name: 'tag_v', 
			Defaults: {
				editor: {
					xtype: 'smartcombobox',
					fields: ['name','name'], 
					url: moneta.Globals.lists.LIST_TAGS, 
					valueField: 'name', 
					displayField: 'name'
				},
			},
			GridOptions: {
				text: 'Tag', width: 90, align: 'left', sortable: true,
				// Custom renderer
				renderer: function(value, p, r) {
					return Ext.String.format('<b>{0}</b>', ((r.data.hasOwnProperty('tag_v') && r.data['tag_v'] != null) ? r.data['tag_v'] : '&lt;empty&gt;'));
				},

			},
			FormOptions: {
				fieldLabel: "Tag",
			}
		},
		/* FIELD: Description */
		{name: 'description', 
			GridOptions: {
				text: "Description", flex :2, align: 'left', sortable: false, hidden: false,
				// Custom editor - multiline textedit 
				editor: {
					xtype: 'textareafield',
					allowBlank: false,
					grow: true,
				},
				// Custom renderer
				renderer: function(value, p, r) {
					return Ext.String.format('<i>{0}</i>', r.data['description']);
				},
			}, // endof smartgrid	
			FormOptions: {
				fieldLabel: "Description",
				editor: {
					xtype: 'textareafield',
					allowBlank: false,
					grow: true,
				},
				allowBlank: false,
			}
		},
	],
	idProperty: 'id'
});