
Ext.define("moneta.conf.InactivityMonitor", {
	singleton: true,
	
	// For timing
	ONESECOND: 1000,
	ONEMINUTE: 60000,
	
	resetTimeout: function () {
		monitor = moneta.Globals.deamons.InactivityMonitor;
		console.log('resetTimeout');			
		if (!monitor._inactivityTask) {
			monitor._inactivityTask = new Ext.util.DelayedTask(monitor._beginCountdown, monitor);
		}
		monitor._inactivityTask.delay(monitor.config.inactivityTimeout);
	},
});


Ext.define("moneta.daemons.InactivityMonitor", { 
	mixins: {
        observable: 'Ext.util.Observable'
    },
	
	// Default configuration
	config: {
		messageBoxConfig: {}, // allows developers to override the appearance of the messageBox
		
		pollActionParam: "a",
		pollAction: "StayAlive",
		pollInterval: moneta.conf.InactivityMonitor.ONEMINUTE,
		// how long should the messageBox wait (in seconds)?
		messageBoxCountdown: 30, 
    },
	
    constructor: function(config) {   	
		console.log('Creating InactivityMonitor');
		
		// Initialize local events
		this.addEvents('timeout');
		Ext.merge(this.config, config);
		this.mixins.observable.constructor.call(this, this.config);
		//this.callParent([Ext.apply(config, this.config)]);		
		var me = this.__proto__;
		
        if (me.config.inactivityTimeout >= moneta.conf.InactivityMonitor.ONEMINUTE) {
            me._pollTask = Ext.TaskManager.start({
                run: function () {
                    var params = {};
                    params[me.config.pollActionParam] = me.config.pollAction;
					console.log('pollTask: requesting url: ' + me.config.pollUrl + ' params: ' + me.config.pollActionParam + ' -> ' + me.config.pollAction);
                    Ext.Ajax.request({
						url: me.pollUrl,
						method: 'GET',
						params: params,
						success: function(response){
							var result = moneta.Globals.handlers.checkAjaxResponse(response);
							if (result) {
								moneta.conf.InactivityMonitor.resetTimeout();
							}
						},
					});
					
                },
                interval: me.config.pollInterval,
                scope: me
            });           
        }
		
		console.log('Timeout handlers');
		
		moneta.Globals.deamons.InactivityMonitor = me;
		
		var body = Ext.getBody();
		body.on("click", moneta.conf.InactivityMonitor.resetTimeout);
        body.on("keypress", moneta.conf.InactivityMonitor.resetTimeout);
    },
    
    destroy: function() {
		var me = this;
        var body = Ext.getBody();
        body.un("click", moneta.conf.InactivityMonitor.resetTimeout);
        body.un("keypress", moneta.conf.InactivityMonitor.resetTimeout);
		Ext.TaskManager.stop(me._pollTask);
		me._inactivityTask.cancel();
		Ext.TaskManager.stop(me._countdownTask);
    },
    
    
    // private stuff
    _pollTask: null, // task to poll server
    _countdownTask: null, // ONESECOND interval for updating countdown MessageBox
    _countdownMessage: null, // countdown MessageBox
    _inactivityTask: null, // task to start countdown
    _beginCountdown: function () {
		var me = this;
        var config = Ext.apply({
            buttons: {ok: "Keep Working"},
            closable: true,
			// When stopped the countdown
            fn: function (btn) {
                Ext.TaskManager.stop(me._countdownTask);
				moneta.conf.InactivityMonitor.resetTimeout();
            },
            msg: "Your session has been idle for too long.  Click the button to keep working.",
            progress: true,
            scope: me,
            title: "Inactivity Warning"
        }, me.config.messageBoxConfig);
        if (!me._countdownMessage) {
			// only create the MessageBox once
            me._countdownMessage = Ext.MessageBox.show(config);
        }
        var win = me._countdownMessage;
        if (!win.isVisible()) {
            win.show(config);
        }
        win.updateProgress(0);
        win.seconds = 0;
        me._countdownTask = Ext.TaskManager.start({
            run: function () {
                win.seconds += 1;
                if (win.seconds > me.config.messageBoxCountdown) {
                    Ext.TaskManager.stop(me._countdownTask);
                    me.fireEvent("timeout", me, win);
                } else {
                    win.updateProgress(win.seconds / me.config.messageBoxCountdown);
                }
            },
            scope: me,
            interval: moneta.conf.InactivityMonitor.ONESECOND,
        });
    }
});