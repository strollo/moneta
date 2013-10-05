Ext.Loader.setConfig({enabled: true});

/**
 * showDetails: given a type (1 - exits, 2 - entries, 3 - transfers, 4 - journal)
 * and a ledger it, it returns all the values for it.
 * notice: if the ledger is null the global value of type is returned.
 */
function showReconciliations() {
	var container = Ext.create('Ext.window.Window', {
		title: 'Reconciliations',
		width: 600,
		minHeight: 400,
		layout: 'fit',
		resizable: true,
		autoScroll: true,
		renderTo: Ext.getBody(),		
	});
	
	// The target URL
	var url = moneta.Globals.data.DATA_RECONCILIATION_DETAILS + '?';
	// The store
        var gridStore = Ext.create('moneta.store.SmartStore', 'moneta.model.Reconciliation', url, 'data',
		// custom params
		{
			// paging of 50 entries
			pageSize: 50, 
			// default sorting on dates desc
			sorters: [{property: 'date',direction: 'DESC'}]			
		});
	// The grid
	var grid = Ext.create('moneta.widgets.SmartGrid', { 
		model: 'moneta.model.Reconciliation', 
		enableEdit: false,
		enableExternalEdit: true,
		frame: false,
		border: 0,
		store: gridStore,
		//title: 'Reconciliations',
		
		plugins: [{
			grid: grid,
			ptype: 'rowexpander',
			enableLocking: true,
			selectRowOnExpand : true,  
			// Disable this since the double click will also trigger edit feature.
			expandOnDblClick: true,
			rowBodyTpl: new Ext.XTemplate(
				'<p><b>Description</b>:</p><p class="x-grid-description">{description}</p>',
				'<p><table>' +
				'<tr><td class="x-grid-row x-grid-cell" ><b>From: </b></td><td class="x-grid-row x-grid-cell" width="100px">{from_v}</td></tr>' +
				'<tr><td class="x-grid-row x-grid-cell" ><b>To: </b></td><td class="x-grid-row x-grid-cell" width="100px">{to_v}</td></tr>' +
				'</table></p>'
			),
		}]
	});
	grid.closable = true;
	container.add(grid);
	container.show();
};