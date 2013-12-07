
// This function is called on the login load end
function onLogin() {
	if (showAccounts) {
		showAccounts();
	}	
	console.log('starting threads');
	// Starts the session manager thread
	Ext.create('moneta.daemons.InactivityMonitor', {
		id: moneta.Globals.id.TH_INACTIVITY_MON,
		inactivityTimeout: 		6000, // one minute (in milliseconds)
		messageBoxCountdown: 	5, // in seconds
		listeners: {
			timeout: function() { window.location = "php/logout.php"; }
		},
		pollUrl: "php/ping.php"
	});
}