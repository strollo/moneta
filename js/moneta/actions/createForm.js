
/*
 * Creates a new form given its id, title, model and url.
 * Notice that the form can be created in a standalone mode (default) so that 
 * it is embedded inside a window.
 * If the parameter parentGrid is passed, it will be refreshed at the and 
 * of operation.
 */
function createForm(id, title, model, url, standalone, parentGrid) {
	var isStandAlone = true;
	if (standalone != null) {
		isStandAlone = standalone;
	}
	var winID = null;
	var formID = null;
	if (isStandAlone) {
		winID = id;
		formID = id + '_form';
	} else {
		formID = id;
	}

	if (Ext.getCmp(winID)) {
		moneta.Globals.fn.clog('Reciclying old form: ' + winID);
		return Ext.getCmp(winID);
	}
	var form = Ext.create(
		// Type
		'moneta.widgets.SmartForm',
		// ID,
		formID,
		// Model
		model,
		// url
		url,
		// Title
		null
	);
	if (form) {
		form.parentGrid = parentGrid;
		form.autoScroll = true;
	}
	if (!isStandAlone) {
		form.title = title;
		return form;
	}
	
	var win = Ext.create('Ext.window.Window', {
		title: title,
		width: 400,
		id: winID,
		minHeight: 400,
		layout: 'fit',
		resizable: true,
		autoScroll: true,
		renderTo: Ext.getBody(),
		
		listeners: {
			beforeclose: function() { 
				form.destroy();
				this.destroy();
				return false;
			}
		}
	});
	form.autoScroll = true;
	win.add(form);
	return win;
}

