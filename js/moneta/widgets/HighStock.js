
function buildHighStock(self, response) {
	var chartOptions = {
		
		chart: {
			renderTo: self.config.id,
			reflow: true,
			borderRadius: 0,
		},
		title: {
			text: '',
			style: {
				display: 'none'
			}
		},
		series : [
			{	
				tooltip: {
					valueDecimals: 2
				}
			}
		],
		xAxis: {	
			// Needed for many points
			// Due to bug http://jsfiddle.net/highcharts/FQm4E/1/
			ordinal: false,
		},
		credits: {enabled: false},
		rangeSelector : {
			selected : 1
		},
	}; 
	res = Ext.JSON.decode(response.responseText);
	
	var gdata = new Array();
	// Maps json response [name,value] to the highcharts required format
	for (var i = 0; i < res.data.length; i++) {
		var elem = new Array();
		elem[0] = parseInt(res.data[i].name);
		elem[1] = parseFloat(res.data[i].value);
		gdata.push(elem);
	}
	chartOptions.series[0].name = 'Value';
	chartOptions.series[0].data = gdata;
	/*
	chartOptions.series[0].pointInterval = 10 * 24 * 3600 * 1000; // 10 days
	chartOptions.series[0].ordinalSlope = null;
	*/
	
	var retval = new Highcharts.StockChart(chartOptions);			
	retval.options.series = chartOptions.series;
	return retval;
}

function handleStockAjax(self, response){	
	var winID = 'win-' + self.config.id;
	var win = null;
	if (Ext.getCmp(winID)) {
		win = Ext.getCmp(winID);
		
		var fields = win.items.items[0].form.getFields();
		var title = moneta.Globals.fn.capitalize(fields.items[0].rawValue);
		win.setTitle(title);
	} else {	
		win = Ext.create('moneta.widgets.EmbeddedWindow',
		// The containerID
		'main::center-body',
		{
			id: winID,
			title: self.config.title || 'Chart',
			layout: {
				type: 'border',
				regionWeights: {
					/* if 0 the north is full span otherwise the west is full span */
					west: 0,
					north: 0,
					south: 1,
					east: 1
				}
			},		
			items: [
				// OPTIONS FORM
				{
					xtype: 'form',
					baseCls: 'x-panel-header-custom',
					padding: 5,
					region : "north",
					height: 'auto',
					collapsible : false,
					split : false,	
					border: '1px',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'label',
							text: 'Activity:',
							padding: 4,
							flex: 1
						},
						{						
							xtype: 'smartcombobox',
							url: moneta.Globals.lists.LIST_ACTIVITY_TYPES,
							fields: ['id','name'],
							valueField: 'id',
							displayField: 'name',
							multiSelect: false,
							flex: 2
						},
						{
							xtype: 'menuseparator',
							baseCls: 'x-panel-header-custom',
							flex: 3
						},
						{						
							xtype: 'button',
							text: 'Update',
							handler: function() {
								var fields = this.ownerCt.form.getFields();
								var actType = fields.items[0].value;
								var title = moneta.Globals.fn.capitalize(fields.items[0].rawValue);
								var oldChart = this.ownerCt.ownerCt.items.items[this.ownerCt.ownerCt.items.length-1];								
								showStocks(oldChart.id, title, actType);
							},
							flex: 1
						},
					],					
				}, // ENDOF - OPTIONS FORM	
				{
					region : "center",
					layout: 'fit',
					xtype: 'panel',
					id: self.config.id,
				}
			],
			listeners: {
				// Handles the resize
				resize: function( self, width, height, eOpts ) {
					// The panel of charts is supposed to be the last inserted one.
					var parent = self.items.items[self.items.items.length-1];
					var chart = parent['innerchart'];
					if (chart) {
						// The auto-resize magic :D
						var w = parent.getSize().width;
						var h = parent.getSize().height;
						chart.setSize(w,h);
					}
					return true;
				}
			}
		});
		var viewport = Ext.ComponentQuery.query('viewport')[0];
		win.width = viewport.width - 100;
		win.height = viewport.height - 100;
		win.show();
	}
	
	win.mask();
	var panel = win.items.items[win.items.items.length-1];	
	var chartH = buildHighStock(self, response);
	// Tracks the chart inserted in this panel
	panel['innerchart'] = chartH;
	win.unmask();
};

/*
 * Sample:
 * 	c = Ext.create('moneta.widgets.HighChart', {url: 'THEURL', id: 'THEID', title: 'Title', type:'pie'})
 * 	c.loadData();
 */
Ext.define('moneta.widgets.HighStock', {
	extend: 'Ext.panel.Panel',
	xtype: 'hchart',	

	loadData: function() {
		var me = this;		
		var req = Ext.create('moneta.smart.SmartAjaxReq', me.config);
		req.load();
	},	
	constructor: function(cfg) {
		var me = this;
		if (cfg == null) {
			throw 'Cannot create ' + me.name + ' with no configuration';
		}
		moneta.Globals.fn.checkParam(me, cfg, 'id');
		moneta.Globals.fn.checkParam(me, cfg, 'url', false);
		moneta.Globals.fn.checkParam(me, cfg, 'title', false);
		me.config.successHandler = handleStockAjax;
		me.callParent([Ext.apply(me.config, cfg)]);
	}
});