Ext.Loader.setConfig({enabled: true});

/*
Ext.Loader.setPath('Ext.ux', 'extjs/src/ux/');
Ext.require([
	'Ext.ux.PreviewPlugin',
]);	
// This is to use in place of RowExpander
var grid = Ext.create('moneta.widgets.SmartGrid', { 
	....
	viewConfig: {
		id: 'gv',
		trackOver: false,
		stripeRows: false,
		plugins: [{
			ptype: 'preview',
			bodyField: 'excerpt',
			expanded: true,
			pluginId: 'preview'
		}]
	},
	....
}
*/

/*
 * Used to render data details for nodes.
 */

/**
 * showDetails: given a type (1 - exits, 2 - entries, 3 - transfers, 4 - journal)
 * and a ledger it, it returns all the values for it.
 * notice: if the ledger is null the global value of type is returned.
 */
function showDetails(activityType, accountID, _title) {
	// The panel that will contain the grid
	container = Ext.create('Ext.panel.Panel', {
		id: 'moneta.widgets.wnAccount.grid',
		layout: 'fit',
		frame: false,
		border: 1,
	});
	var win = moneta.widgets.ToggableWindow.get(moneta.Globals.id.UI_WIN_ACCOUNTS);
	if (!win) {
		return;
	}
	win.addComponent('center', container, null /* no header */);
	// The target URL
	var url = moneta.Globals.data.DATA_ENTRY_DETAILS + '?node=root' + (activityType ? ('&type=' + activityType) : '') + (accountID ? ('&account=' + accountID) : '')
	// The store
        var gridStore = Ext.create('moneta.store.SmartStore', 'moneta.model.Entry', url, 'data',
		// custom params
		{
			// paging of 50 entries
			pageSize: 50, 
			// default sorting on dates desc
			sorters: [{property: 'date',direction: 'DESC'}]			
		});
	// The grid
	var grid = Ext.create('moneta.widgets.SmartGrid', { 
		model: 'moneta.model.Entry', 
		enableEdit: false,
		enableExternalEdit: true,
		frame: false,
		border: 0,
		store: gridStore,
		title: _title,

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
	
};