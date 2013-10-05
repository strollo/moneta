/*
 * Taken from: http://www.sencha.com/forum/showthread.php?228840-Ext.grid.Panel-AutoGenerateColumns
 * Thanks to: Lukas Sliwinski (sliwinski.lukas@gmail.com)
 */

Ext.Loader.setConfig({enabled: true});
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.toolbar.Paging',
    'Ext.ModelManager',
    'Ext.tip.QuickTipManager'
]); 

 
 Ext.override(Ext.grid.Panel, {
	initComponent : function () {
		this.autoGenerateColumn();
		this.checkGrouping();
		this.checkPaging();
		this.checkEditing();
		this.checkCRUD();
		this.callParent(arguments);
	}
});

/*
 * List of model fields not of type string that are to
 * be included in the corresponding store.
 */
var sg_includeFields = new Array(
	'renderer', 
	'editor'
);

var _currGrid = null;

var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	id: 'group',
	ftype: 'multigrouping',
	groupHeaderTpl: [
	  '{name:this.formatName} ({rows:this.formatTotal})',
	  //'{name:this.formatName} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
	  {
		  formatName: function(name) {
			  var sName = (name == "") ? "None ": name;
			  return sName;
		  },			  
		  formatTotal : function (values) {
			var i = 0;
			var retval = 0;
			for (i=0; i < values.length; i++) {
				retval += parseFloat(values[i].data.amount);
			}
			return retval.toFixed(2);
		 }
	}],
});

var mnuGridEdit = new Ext.menu.Menu({
	items: [
		{text: 'Edit',
			listeners: { click: function(event, node, x, y){ 
				w = createEditForm('edt', _currGrid.model.create(), _currGrid);
				w.show();
			}}
		},
	]
});


/**
 * The columns are autogenerated from the model assigned to the store.
 * Usage:
 * <pre>
 * Ext.define('mymodel.Entry', {
 *			extend: 'Ext.data.Model',
 *			fields:[
 *				{name: 'id', type: 'int'}, // column will be not created
 *				{name: 'field1', type: 'string', visible: true},
 *				{name: 'field2', type: 'floatOrString', visible: false, 
 *					// ... all the params of colum can be appended here  ...
 *					width: 80,
 *					text: 'The Label', 
 *				}
 *			],
 *			idProperty: 'id'
 *		});
 * </pre>
 */
Ext.define('moneta.widgets.SmartGrid', 
{
	extend: 'Ext.grid.Panel',
	autoDestroy : true,
	
	viewConfig: {
		loadMask: true,
		forceFit:true,
		align:'stretch',
	},
	
	/* Additional features - by default they are enabled */
	// Allows the auto generation of columns from the model
	enableAutoColumns: true,
	// Allows the automatic paging - the field (store.pageSize: 50) will deside the entries per page
	enablePaging: true,
	// Allows grouping on columns. To disable grouping on a column put (groupable: false) in the model.
	enableGrouping: true,
	// Enables Delete/Edit/Update buttons
	enableCRUD: true,
	// Enables editing on columns - the editable columns must be declared in the model
	// with a form (editor: 'textfield')
	// @see http://docs.sencha.com/extjs/4.1.1/#!/api/Ext.Editor for more details
	enableEdit: false,
	// The edit will open an external form to modify the data
	enableExternalEdit: false,
	
	getEditor: function() {
		// Checks if there is the editor plugin installed
		// otherwise no editing allowed.
		for (var i = 0 ; i < this.plugins.length; i++) { 
			if (this.plugins[i].hasOwnProperty('editor')) {
				return this.plugins[i].editor;
			}
		}
		return null;
	},
	
	refreshData: function() {
		var grid = this;
		var sm = grid.getSelectionModel();
		var rowEditor = grid.getEditor();
		
		if (!rowEditor) {
			grid.store.reload()
		} else {
			rowEditor.cancelEdit();
			grid.store.sync();
			grid.store.reload();
		}
	},
		
	checkPaging: function() {
		var me = this;
		
		if ( !Ext.isDefined(me.enablePaging) || me.enablePaging != true ) {
			return;
		}
		// paging bar on the bottom
		me.bbar = Ext.create('Ext.PagingToolbar', {
			store: me.store,
			displayInfo: true,
			displayMsg: 'Displaying elems {0} - {1} of {2}',
			emptyMsg: "No elems to display",
		});
	},
	
	checkCRUD: function() {
		var me = this;
		if ( !Ext.isDefined(me.enableCRUD) || me.enableCRUD != true ) {
			return;
		}
		if (!me.dockedItems) {
			me.dockedItems = new Array();
		}
		
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			parentGrid: me,
			items: [
			// The Add button creates an auto-generated form by using the
			// model description and the crud section to retrieve the URL
			// and the method to use.
			{
				text: 'Add',
				handler: function() {
					var grid = this.ownerCt.parentGrid;					
					var _m = grid.model.create();
					
					/*
					 * Custom handler for CreateElem button
					 */
					if (_m.hasOwnProperty('onCreateElem')) {
						_m.onCreateElem();
						return;
					}
					if (_m.hasOwnProperty('crud') || _m.crud != null) {
						var crud = _m.crud;
						createForm(
							// ID
							crud.id,
							// Title
							crud.title || 'Insert new elem',
							// Model
							_m.modelName,
							// URL
							crud.url,
							true,
							me).show();
						return;
					}
					
					console.log('[SmartGrid] onCreateElem not defined on model ' + _m.$className);
				}
			},
			{
				text: 'Delete',
				handler: function() {
					var me = this;
					Ext.Msg.show({
						 title:'Confirm Delete',
						 msg: 'Are you sure?',
						 buttons: Ext.Msg.OKCANCEL,
						 icon: Ext.Msg.QUESTION,
						 fn: function(btn, text){
							if (btn == 'ok'){
								var grid = me.ownerCt.parentGrid;
								var sm = grid.getSelectionModel();
								var rowEditor = grid.getEditor();
								
								if (rowEditor) {
									rowEditor.cancelEdit();
								}
								
								grid.store.remove(sm.getSelection());
								if (grid.store.getCount() > 0) {
									sm.select(0);
								}
								grid.store.save();
								grid.store.sync();
							}
						}
					});	
				}
			},
			{
				text: 'Refresh',
				handler: function() {
					var grid = this.ownerCt.parentGrid;
					grid.refreshData();
				}
			},
			]    
		});
		me.dockedItems.push(toolbar);
	}, // checkCRUD
	
	handleEditField: function(editor, e, eOpts) {
		console.log('[SmartGrid] handleEditField');
	},
	
	checkEditing: function() {
		var me = this;
		// Editing inside grid
		if ( (!Ext.isDefined(me.enableEdit) || me.enableEdit != true) &&
			// CRUD implies editing feature
			(!Ext.isDefined(me.enableCRUD) || me.enableCRUD != true) ) 
		{		
			return;
		}
		// Editing in an external window
		if ((!Ext.isDefined(me.enableCRUD) || me.enableCRUD != true) && 
			((!Ext.isDefined(me.enableExternalEdit) || me.enableExternalEdit != true))) 
		{
			return;
		}
		
		// If required the external edit the editing inside grid will be disabled
		if (!me.enableExternalEdit) {
			moneta.Globals.fn.clog('[GRID] Grid editing');
			// Editing inside grid
			me.selModel = 'rowmodel';
			if (!me.plugins) {
				me.plugins = new Array();
			}
			var editor = Ext.create('Ext.grid.plugin.RowEditing', {
					id: 'gridEditor',
					clicksToMoveEditor: 1,
					autoCancel: false,
				});
			editor.on('edit', me.handleEditField, this, { single: true, delay: 100 });
			me.plugins.push(editor);	
		} else {
			// Editing in an external window
			moneta.Globals.fn.clog('[GRID] External editing');
			
			this.addListener('itemcontextmenu', function handleContextMenu(grid, record, item, index, event) {
				// To disable standard menu
				event.preventDefault();
				moneta.Globals.fn.clog('[GRID] Selected item');
				_currGrid = me;
				x = event.browserEvent.clientX;
				y = event.browserEvent.clientY;
				mnuGridEdit.showAt([x, y]);
			});
		}
	}, // checkEditing
	
	checkGrouping: function() {
		var me = this;
		if ( !Ext.isDefined(me.enableGrouping) || me.enableGrouping != true ) {
			return;
		}
		
		if (me.enableGrouping === true) {
			if (me.features == null) {
				me.features = [groupingFeature];			
			} else {
				me.features.push(groupingFeature);
			}
		}
	}, // checkGrouping
	
	autoGenerateColumn : function () {
		var me = this;

		if (Ext.isDefined(me.model) === false && Ext.isDefined(me.enableAutoColumns) === false) {
			console.log('SmartGrid: auto generate columns is not defined or model is missing.');
			return;
		}

		if (me.enableAutoColumns === true) {
			if (Ext.isString(me.model)) {
				me.model = Ext.ModelManager.getModel(me.model);
			}

			var modelFields = me.model.prototype.fields;
			me.columns = new Array();

			// Adding columns to grid
			for (var i = 0; i < modelFields.length; i++) {
				var modelField = modelFields.items[i];
				var fieldName = modelField.name;
				var fieldType = modelField.type.type;
				
				if (modelField.GridOptions != null) {
					modelField = modelField.GridOptions;
				} else {
					modelField = new Object();
				}

				// Merges GridOptions section with Defaults one.
                                // The GridOptions fields will not be overridden.
                                if (modelFields.items[i].Defaults != null) {
                                        modelField = Ext.Object.merge(modelField, modelFields.items[i].Defaults);
                                }			
				
				// The special skip (bool) will not include in columns the current modelField.
				var mustSkip = (Ext.isDefined(modelField.skip) && (modelField.skip === true));

				// Skips hidden columns
				if (mustSkip) {
					continue;
				}
				
				var column = Ext.create('Ext.grid.column.Column',
				{
					header : fieldName,
					dataIndex : fieldName,
				});

				// Custom renderer for numbers
				if (fieldType === 'floatOrString') {
					column.renderer = Ext.util.Format.numberOrString;
					column.editor = Ext.create('Ext.form.field.Number');
				}
				
				// Appends standard text editing features if editor not defined
				// If in your model you have "editable: true" it appends the default text editor
				if (modelField.hasOwnProperty('editable') && modelField['editable'] === true) {
					if (!column.hasOwnProperty('editor')) {
						//column.editor =  new Object {xtype: "textfield"};
						column.editor = Ext.create('Ext.form.TextField');
					}
				}
				
				// Appends all the fields of the model to the column
				for(var property in modelField) {
					// These fields are not ported
					if (property[0] == '$') continue;
					if (typeof(modelField[property]) == 'string' ||
						typeof(modelField[property]) == 'boolean' ||
						typeof(modelField[property]) == 'number' ||
						// Particular fields (functions) that must be included
						sg_includeFields.indexOf(property)  != -1) 
					{
						column[property] = modelField[property];
					}
				}

				me.columns.push(column);
			}
		}

		if (me.columns.length == 0) {
			Ext.Error.raise('No fields declared in ' + me.model.$className + ' with property visible. Columns will not be created!');
		}
	} // autoGenerateColumn
});

