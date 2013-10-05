Ext.Loader.setConfig({enabled: true});
Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.ModelManager',
    'Ext.tip.QuickTipManager'
]); 


/**
 * Takes the section FormOptions from the model and uses it to create the form.
 */
Ext.define('moneta.widgets.SmartEditForm', 
{
	extend: 'Ext.form.Panel',
	autoDestroy : true,
	
	/* Additional features - by default they are enabled */
	// Allows the auto generation of columns from the model
	enableAutoFields: true,
	
	config: {
			method: 'GET',
	
			layout: {
				type: 'vbox',
				align: 'stretch'
			},			
			border: false,
			bodyPadding: 10,
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 100,
				labelStyle: 'font-weight:bold'
			},
			defaults: {
				margins: '0 0 0 0'
			},
			
			//defaultType: 'textfield',
			// Reset and Submit buttons
			buttons: [{
				text: 'Reset',
				handler: function() {
					this.up('form').getForm().reset();
				}
			}, {
				text: 'Submit',
				formBind: true, //only enabled once the form is valid
				disabled: true,
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
						form.submit({
							url: this.url , 
							method: 'GET',
							params : { action: 'update', records: Ext.encode(form.getValues(false)) },
							waitMsg: 'Saving...',
							reset: false,
							failure: function(form, action) {
								var msg = 'Generic Error';
								if (action.result && action.result.msg) {
									msg = action.result.msg;
								}
								Ext.Msg.alert('Failed', msg);
							},
							success: function(form, action) {
								form.reset();
								// Closes the insert dialog
								form.owner.ownerCt.close();
								if (form.owner.parentGrid != null && form.owner.parentGrid.refreshData) {
									form.owner.parentGrid.refreshData();
								} else {
									form.owner.parentGrid.store.reload();
								}
								form.owner.parentGrid.selModel.clearSelections();
								form.destroy();
							}
						});   
					}
				}
			}], 
	}, // endof init config
	
	/*
	 * The section FormOptions of the model will be used as skeleton for
	 * building the form.
	 */
	autoGenerateFields : function (data) {
		var me = this;

		if (Ext.isDefined(me.model) === false && Ext.isDefined(me.enableAutoFields) === false) {
			console.log('SmartGrid: auto generate items is not defined or model is missing.');
			return;
		}

		if (me.enableAutoFields === true) {
			if (Ext.isString(me.model)) {
				me.model = Ext.ModelManager.getModel(me.model);
			}

			var modelFields = null;
			if (me.model.prototype) {
				modelFields = me.model.prototype.fields;
			} else {
				modelFields = me.model.fields;
			}
			
			me.config.items = new Array();
			
			// Adding items to form
			for (var i = 0; i < modelFields.length; i++) {
				var modelField = modelFields.items[i];
				var fieldName = modelField.name;
				var fieldType = modelField.type.type;
				
				var fieldValue = null;				
				try {
					if (Ext.isDefined(modelField.valuesFrom)) {
						fieldValue = data[modelField.valuesFrom];
						moneta.Globals.fn.clog('[SmartEditForm] override value for ' + fieldName);
					} else {
						moneta.Globals.fn.clog('[SmartEditForm] using DEFAULT value for ' + fieldName);
						fieldValue = data[fieldName];						
					}	
				} catch (e) {
					fieldValue = data[fieldName];
				}
				
				if (modelField.FormOptions != null) {
					modelField = modelField.FormOptions;
				} else {
					modelField = new Object();
				}

				// Merges FormOptions section with Defaults one.
				// The FormOptions fields will not be overridden.
				if (modelFields.items[i].Defaults != null) {
					modelField = Ext.Object.merge(modelField, modelFields.items[i].Defaults);
				}

				// The special skip (bool) will not include in items the current modelField.
				var mustSkip = (Ext.isDefined(modelField.skip) && (modelField.skip === true));

				// Skips hidden items
				if (mustSkip) {
					continue;
				}
				
				var item = null;
				// The field editor will force the custom editing on the field
				if (Ext.isDefined(modelField.editor)) {
					item = modelField.editor;
					item.name = fieldName;
					item.fieldLabel = modelField.text || fieldName;
					item.value = modelField.defaultValue || '';
				} else if (!Ext.isDefined(modelField.renderType)) {
					item = Ext.create('Ext.form.field.Text',
					{
						name : fieldName,
						fieldLabel: modelField.text || fieldName,
						value: fieldValue || modelField.defaultValue,
					});	
				} else {
					item = Ext.create(modelField.renderType,
					{
						name : fieldName,
						fieldLabel: modelField.text || fieldName,
					});	
				}
				
				// Appends all the fields of the model to the column
				for(var property in modelField) {
					// These fields are not ported
					if (property[0] == '$') continue;
					item[property] = modelField[property];
				}
				item.value = fieldValue;

				me.config.items.push(item);
			}
		}
		
		if (me.config.items == null || me.config.items.length == 0) {
			Ext.Error.raise('No fields declared in ' + me.model.$className + ' with property visible. Items will not be created!');
		}
	}, // autoGenerateFields
	
	/**
	 * Constructor
	 * @param id - required - the id to assign the the form
	 * @param model - required - the model for the store
	 * @param url - required - where to upload data for editing
	 * @param grid - optional - when editing inside a grid the data is automatically taken from its selection
	 * @param elem - optional - if data is manually provided (grid is not passed) the form will be filled by this data
	 * @param extcfg additional configuration if needed (optional)
	 */
	constructor: function (id, model, url, grid, elem, extcfg) {
		moneta.Globals.fn.clog('Creating a SmartEditForm: id [' + id + '] model [' + model + ']' );
	
		var me = this;
			cfg = extcfg || {};
		me.config.url = url;
		me.model = model;
		me.id = id;
		
		var data = null;
		if (elem != null) {
			data = elem;
		} else {
			data = grid.selModel.selected.get(0).data;
		}
		
		me.autoGenerateFields(data);
		if (me.config.items) {
			me.config.items.push(model.items);
		} else {
			me.config.items = model.items;
		}
		
		me.callParent([Ext.apply(me.config, cfg)]);
	},
	
});

