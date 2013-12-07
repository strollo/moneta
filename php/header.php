
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
		<script type="text/javascript" src="js/moneta/actions/all.js"></script>		
		
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
		<script type="text/javascript" src="js/moneta/widgets/all.js"></script>
		
		
		<!-- Menus -->
		<?php include 'js/moneta/components/menu.js.php'; ?>
		
		<script type="text/javascript" src="js/moneta/app.js"></script>
<?php
	} // endof auth user	
?>
</head>
<body>	

