
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
		legend: {
	    	enabled: true,
	    	align: 'right',
        	backgroundColor: '#FCFFC5',
        	borderColor: 'black',
        	borderWidth: 2,
	    	layout: 'vertical',
	    	verticalAlign: 'top',
	    	y: 100,
	    	shadow: true
	    },
		
		series : [],
		xAxis: {	
			// Needed for many points
			// Due to bug http://jsfiddle.net/highcharts/FQm4E/1/
			ordinal: false,
		},
		credits: {enabled: false},
		rangeSelector : {
			selected : 1
		},
		yAxis : {
			plotLines : [{
				value : 0,
				color : 'red',
				dashStyle : 'shortdash',
				width : 2
			}]
		},
	}; 
	res = Ext.JSON.decode(response.responseText);
	
	// Maps json response [name,value] to the highcharts required format
	if (!res.data) {
		return null;
	}
	
	var total = 0;
	var min = 0;
	var max = 0;
	for (var i = 0; i < res.data.length; i++) {
		var gdata = new Array();
		
		if (!res.data[i].data) {
			return null;
		}
		
		for (var j = 0; j < res.data[i].data.length; j++) {
			var elem = new Array();
			elem[0] = parseInt(res.data[i].data[j].name);
			elem[1] = parseFloat(res.data[i].data[j].value);
			gdata.push(elem);
			
			// Evaluates the average amount of first series
			if (i==0) {
				total += parseFloat(res.data[i].data[j].value);
				if (parseFloat(res.data[i].data[j].value) < min) {
					min = parseFloat(res.data[i].data[j].value);
				}
				if (parseFloat(res.data[i].data[j].value) > max) {
					max = parseFloat(res.data[i].data[j].value);
				}
			}
		}
		chartOptions.series[i] = new Object();
		chartOptions.series[i].name = res.data[i].label;
		chartOptions.series[i].data = gdata;
		chartOptions.series[i].shadow = true;
		chartOptions.series[i].marker = {
			enabled : true,
			radius : 3
		};
	}
	
	// adds a line to represent the average of first series
	try {
		var average = new Object();
		average.value = parseFloat(total / res.data[0].data.length).toFixed(2);
		average.color = 'green';
		average.dashStyle = 'shortdash';
		average.width = 1;
		
		average.label = {
			text: 'avg',
			align: 'right',			
		};
		
		chartOptions.yAxis.plotLines[1] = average;
		
		chartOptions.subtitle = new Object();
		chartOptions.subtitle.useHTML = true;
		chartOptions.subtitle.text = '<b>' + res.data[0].label + '</b>&nbsp;-&gt;&nbsp;&nbsp;<b>Avg:</b>&nbsp;(' + average.value + ')&nbsp;<b>Min:</b>&nbsp;(' + min + ')&nbsp;<b>Max:</b>&nbsp;(' + max + ')';
	} catch (e) {
		moneta.Globals.fn.clog(e);
	}
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
				// The container of highchart to embed
				{
					region : "center",
					layout: 'fit',
					id: self.config.id,
					xtype: 'panel',
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
	
	// The header form to change data
	var form = Ext.create('Ext.form.Panel', {
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
	});
	
	if (!self.config.hideToolBar) {
		win.add(form);
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
	
	config: {
		// Allows to remove the toolbar with graph options
		hideToolBar: false,
	},

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
	},
	onDestroy: function () {
		moneta.Globals.fn.clog('Destroying HighStock: [' + this.id + ']');
		return true;
	},
});