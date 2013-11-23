

Ext.define("moneta.Globals.configuration", {
	singleton: true,
	
	DEBUG: true,
});

Ext.define("moneta.Globals.deamons", {
	singleton: true,
	
	 // Start a simple clock task that updates a div once per second
	 allocationsFn: Ext.TaskManager.start({
		 run: function() {
			try {
				txt = Ext.getCmp(moneta.Globals.id.UI_MNU_ALLOCATIONS);
				txt.setText('Allocated Objs: [' + document.getElementsByTagName('*').length + ']');
			} catch (e) {}
		 },
		 interval: 1000
	 }),
});

/*
 * Shared resources
 */
Ext.define("moneta.Globals.widgets", {
	singleton: true,
	
	/* The main application (viewport) */
	mainapp: null,
	
	/* singleton window */
	wnAccount: null,
	wnUsers: null,
});

Ext.define("moneta.Globals.id", {
	singleton: true,
	
	UI_APPLICATION: 'mainapp',
	UI_STATUS_BAR: 'main::statusbar',
	UI_WIN_ACCOUNTS: 'win::accounts',
	UI_WIN_PROJECTS: 'win::projects',
	UI_WIN_USERS: 'win::users',
	UI_WIN_CHARTS: 'win::charts',	
	UI_WIN_TAGS: 'win::tags',
	UI_TREE_ACCOUNTS: 'tree::accounts',	
	
	UI_WIN_HELP: 'win::help',	
	
	UI_MNU_ALLOCATIONS: 'components::ui::allocations',	
});

Ext.define("moneta.Globals.handlers", {
	singleton: true,
	
	onDestroy: function (self, eOpts) {
		moneta.Globals.fn.clog('Destroying component: [' + self.id + ']' + ' of type: ' + (self.$className || 'undef'));
	},
	onHide: function (self, eOpts) {
		moneta.Globals.fn.clog('Hiding component: [' + self.id + ']');
	},
	checkAjaxResponse: function (response) {
		var res = new Object();
		try {
			res = Ext.JSON.decode(response);
		} catch (e) {
			res = Ext.JSON.decode(response.responseText);
		}
		if (res.success == 'false' || res.error == 'true') {
		   Ext.MessageBox.show({
			   title: 'Error',
			   msg: res.msg,
			   buttons: Ext.MessageBox.OK,
			   icon: Ext.MessageBox.ERROR
		   });
		}
	}
});


Ext.define("moneta.Globals.fn", {
	singleton: true,
	
	maskAll: function (msg) {
		Ext.getCmp(moneta.Globals.id.UI_APPLICATION).mask(msg);
	},
	unmaskAll: function () {
		Ext.getCmp(moneta.Globals.id.UI_APPLICATION).unmask();
	},
	
	capitalize: function(p) {
		if (p == null) {
			return null;
		}
		return p.charAt(0).toUpperCase() + p.slice(1);
	},
	
	/* functions */
	log: function (txt) {
		_statusbar = Ext.getCmp(moneta.Globals.id.UI_STATUS_BAR);
		_statusbar.log(txt);
	},
	/* functions */
	clog: function (txt) {
		console.log(txt);
	},
	
	/* useful for comboBox or other grid fields to render the data value from its id */
	idToValue: function (container, idx, column) {
		try {
			return self.store.data.get(idx).data[column];
		} catch (e) {
			return null;
		}
	},
	
	gotoURL : function (_url) {
		Ext.Ajax.request({
			url : _url,
			success : function () {
				window.location = _url; //the location you want your browser to be  redirected.
			},
		});
	},
	
	checkParam: function(caller, cfg, paramName, stop) {
		var msg = 'Cannot create ' + (caller.$className||'<undef>') + ': parameter [' + paramName + '] is missing';
		if (!cfg.hasOwnProperty(paramName)) {
			if (stop !== false) {
				throw msg;
			}
			console.log(msg);
		}
	},
});

var PHP_BASE_DIR = 'php';

Ext.define("moneta.Globals.actions", {
	singleton: true,
	
	ACT_LOGOUT: PHP_BASE_DIR + '/logout.php',
});

Ext.define("moneta.Globals.data", {
	singleton: true,
	
	DATA_ACCOUNTS: PHP_BASE_DIR + '/data/accounts.php',
	DATA_CHART: PHP_BASE_DIR + '/data/chartsdata.php',
	DATA_ENTRY_DETAILS: PHP_BASE_DIR + '/data/entries.php',
	DATA_RECONCILIATION_DETAILS: PHP_BASE_DIR + '/data/reconciliations.php',
	DATA_USERS: PHP_BASE_DIR + '/data/users.php',
	DATA_TAGS: PHP_BASE_DIR + '/data/tags.php',
	DATA_PROJECTS: PHP_BASE_DIR + '/data/projects.php',
	DATA_AVAILABLE_PROJECTS: PHP_BASE_DIR + '/data/availablePrjs.php',
	DATA_BACKUP_PROJECT: PHP_BASE_DIR + '/data/projects.php',
	DATA_SET_CURRENT_PROJECT: PHP_BASE_DIR + '/data/setCurrentPrj.php',
	DATA_ACCOUNT_TYPES: PHP_BASE_DIR + '/data/account_types.php',
});

/* data for combobox */
Ext.define("moneta.Globals.lists", {
	singleton: true,
	
	LIST_TAGS: PHP_BASE_DIR + '/data/lists/tags.php',
	LIST_ACCOUNT_TYPES: PHP_BASE_DIR + '/data/lists/account_types.php',
	LIST_ACTIVITY_TYPES: PHP_BASE_DIR + '/data/lists/activity_types.php',
	LIST_ALLOWED_ACCTS: PHP_BASE_DIR + '/data/lists/allowed_accounts.php',		
	LIST_GROUP_FIELDS: PHP_BASE_DIR + '/data/lists/groupfields.php',
});

Ext.define("moneta.Globals.consts", {
	singleton: true,
	
	// UI custom fields
	WN_ACCOUNT_LABEL: 'Accounts',
});


Ext.define("moneta.Globals.counters", {
	singleton: true,
	
	ID_CHART: 1
});