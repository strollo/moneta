
// This function is called on the login load end
function onLogin() {
	if (showAccounts) {
		showAccounts();
	}	
	// Starts the session manager thread
	Ext.create('moneta.daemons.InactivityMonitor', {
		// 3 minutes after no user activity or no answer from remote ping 
		// the session will be close.
		inactivityTimeout: 		3 * 60 * 1000, 	// 3 minutes (in milliseconds)
		messageBoxCountdown: 	10, 			// in seconds
		listeners: {
			timeout: function() { window.location = "php/logout.php"; }
		},
		logoutUrl: "php/logout.php",
		pollUrl: "php/ping.php"
	});
}