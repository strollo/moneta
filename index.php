
<?php include_once('php/login.php') ?>
<?php include_once('php/header.php') ?>

<?php
if(isset($_SESSION) and isset($_SESSION['authuser'])) {
?>
<script>	
	Ext.onReady(function () {
		Ext.Loader.setConfig({enabled:true});
		var myDesktopApp = Ext.create("moneta.app.Application");
		moneta.Globals.widgets.mainapp = myDesktopApp;
		myDesktopApp.show();
		
		/* Instantiate the menu */
		var myDesktopMenu = Ext.create('moneta.widgets.MainMenu');
		myDesktopApp.addComponent(null, myDesktopMenu, "north");
		
		/* Instantiate the statusbar */
		var statusBar = createStatusBar();
		myDesktopApp.addComponent(null, statusBar, "south");
		
		moneta.Globals.fn.log('> moneta.app.Application: [RUNNING]');
		
		/* Application loaded */
		onLogin();
	});    		
</script>
<?php
}
?>

<?php include_once('php/footer.php') ?>