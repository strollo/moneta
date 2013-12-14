
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Moneta</title>
	
	<link type="text/css" rel="stylesheet" href="extjs/resources/css/ext-all.css">
	<link type="text/css" rel="stylesheet" href="css/moneta.css">
	<link type="text/css" rel="stylesheet" href="css/help.css">
	
	<!-- ExtJS -->
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>	
	<!-- <script type="text/javascript" src="deps/highcharts.src.js"></script>	 -->
	<script type="text/javascript" src="deps/jquery.min.js"></script>	
	<script type="text/javascript" src="deps/highstock.src.js"></script>	
	<script type="text/javascript" src="deps/exporting.js"></script>
		
<?php
	if(isset($_SESSION['authuser'])) {
		// Authorized USER
		// The moneta libraries are loaded only if authorized user.
?>		
		<!-- Moneta deps -->
		<script type="text/javascript" src="js/moneta/resources/globals.js"></script>		
		
		<script type="text/javascript" src="js/moneta/session/SessionMgr.js"></script>
		
		<!-- Actions -->
		<!--
		<script type="text/javascript" src="js/moneta/actions/all.js"></script>	
		-->
		<script type="text/javascript" src="js/moneta/actions/about.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/chooseProject.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/backupProject.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/restoreProject.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showProjects.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showUsers.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showCharts.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showTags.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showStocks.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showNetGrossStock.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showIncrementalProfits.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/showReconciliations.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/createForm.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/createEditForm.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/accounts/create.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/accounts/show.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/accounts/delete.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/accounts/edit.js"></script>			
		<script type="text/javascript" src="js/moneta/actions/entries/create.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/entries/show.js"></script>	
		<script type="text/javascript" src="js/moneta/actions/onLogin.js"></script>	
		
		
		
		<!-- Smart widgets -->
		<script type="text/javascript" src="js/moneta/smart/all.js"></script>		
		<!-- Models -->
		<script type="text/javascript" src="js/moneta/models/all.js"></script>		
		
		<script type="text/javascript" src="js/moneta/help/all.js"></script>		
		
		<script type="text/javascript" src="js/moneta/plugins/all.js"></script>
		
		<script type="text/javascript" src="js/moneta/components/accountTree.js"></script>
		<script type="text/javascript" src="js/moneta/components/statusBar.js"></script>
		
		
		
		<!-- Widgets -->
		<!--
		<script type="text/javascript" src="js/moneta/widgets/all.js"></script>
		-->
		<script type="text/javascript" src="js/moneta/widgets/ToggableWindow.js"></script>
		<script type="text/javascript" src="js/moneta/widgets/HighChart.js"></script>
		<script type="text/javascript" src="js/moneta/widgets/HighStock.js"></script>
		<script type="text/javascript" src="js/moneta/widgets/EmbeddedWindow.js"></script>
		<script type="text/javascript" src="js/moneta/widgets/UploadWindow.js"></script>		
		
		<!-- Menus -->
		<?php include 'js/moneta/components/menu.js.php' ?>
		
		<script type="text/javascript" src="js/moneta/app.js"></script>
<?php
	} // endof auth user	
?>
</head>
<body>	

