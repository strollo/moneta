
<?php
	if(!isset($_SESSION) or !isset($_SESSION['authuser'])) {
		$_user = '-';
	} else {
		$_user = $_SESSION['authuser'];
	}
	
	if(!isset($_SESSION) or !isset($_SESSION['project'])) {
		$_chosenPrj = '-';
	} else {
		$_chosenPrj = $_SESSION['project'];
	}
	
	function isAdmin() {
		return (isset($_SESSION['authuser']) && isset($_SESSION['isadmin']) && $_SESSION['isadmin'] == True);
	}
	function isUser() {
		return (isset($_SESSION['authuser']) && isset($_SESSION['isadmin']) && $_SESSION['isadmin'] == False);
	}
?>

<script type="text/javascript">

function  applyTheme(themeUrl) {
	Ext.util.CSS.swapStyleSheet("theme", themeUrl); 
	var content = Ext.getCmp('mainapp'); 
	content.doLayout();
	moneta.Globals.widgets.mainapp.doAutoRender();
};




<?php
/******************************************************************************
 * MENU ITEMS
 *****************************************************************************/
?>
var mnuProfile = Ext.create('Ext.menu.Item', {
	text: 'Profile',
	handler: function(){ 
		moneta.Globals.fn.log(this.text + " clicked"); 
	},
	icon: 'icons/user.png'
});
var mnuUsers = Ext.create('Ext.menu.Item', {
	text: 'Users',
	handler: function(){ 
		showUsers();
	},
	icon: 'icons/users.png'
});
var mnuProjects = Ext.create('Ext.menu.Item', {
	text: 'Projects',
	handler: function(){ 
		showProjects();
	},
	icon: 'icons/projects.png'
});
var mnuAssets = Ext.create('Ext.menu.Item', {
	text: 'Accounts',
	icon: 'icons/bank.png',
	handler: function(){ 
		showAccounts();
	}
});
var mnuActions =  Ext.create('Ext.menu.Item', {
	text: 'Actions',
	icon: 'icons/actions.png',
	menu: new Ext.menu.Menu({
		items: [
			// Theme::Default
			{ text: 'New Account', icon: 'icons/add_bank.png', handler: function(){ createAccount(); } },
			{ text: 'New Operation', icon: 'icons/add_entry.png', handler: function(){ createEntry(); } },
			{ text: 'Manage Tags', handler: function(){ showTags(); }, icon: 'icons/tags.png'},
		]
	})
});
var mnuExit = Ext.create('Ext.menu.Item', {
	text: 'Exit',
	icon: 'icons/exit.png',
	handler: function(){ 
		moneta.Globals.fn.gotoURL(moneta.Globals.actions.ACT_LOGOUT); 
	}
});
var mnuShowCharts = Ext.create('Ext.menu.Item', {
	text: 'Show Charts', 
	icon: 'icons/chart.png',
	menu: new Ext.menu.Menu({
		items: [
			// Theme::Default
			{ text: 'Pie Charts', handler: function(){ showCharts(); } },
			{ text: 'Stock Charts', handler: function(){ showStocks(); } },
		]
	})
});
var mnuTheme = Ext.create('Ext.menu.Item', {
	text: 'Theme', handler: function(){ moneta.Globals.fn.log(this.text + " clicked"); },
	icon: 'icons/themes.png',
	// THEMES
	menu: new Ext.menu.Menu({
		items: [
			// Theme::Default
			{ text: 'Default', handler: function(){ applyTheme("extjs/resources/css/ext-all-debug.css"); } },
			// Theme::Gray
			{ text: 'Gray', handler: function(){ applyTheme("extjs/resources/css/ext-all-gray-debug.css"); } },
			// Theme::Neptune - DISABLED
			{ text: 'Neptune', handler: function(){ applyTheme("extjs/resources/css/ext-all-neptune-debug.css"); } },
			// Theme::Access
			{ text: 'Access', handler: function(){ applyTheme("extjs/resources/css/ext-all-access-debug.css"); } },
		]
	})
});
var mnuLogout = Ext.create('Ext.menu.Item', {
	text: 'Logout', 
	icon: 'icons/exit.png', 
	handler: function(){ moneta.Globals.fn.gotoURL(moneta.Globals.actions.ACT_LOGOUT); }
});



/*
 * The main ToolBar (Menu)
 */
Ext.define("moneta.widgets.MainMenu",
{
	extend: 'Ext.toolbar.Toolbar', 
    renderTo: document.body,
	items: [
        {
		    xtype: 'button', // default for Toolbars
            text: 'Main',
			menu: new Ext.menu.Menu({
				items: [
					<?php if (isUser() || isAdmin()) : ?> mnuAssets, <?php endif ?>
					<?php if (isUser() || isAdmin()) : ?> mnuActions, <?php endif ?>	
					'-',					
					mnuExit
				]
			})
        },
		// Admin menu
		<?php if (isAdmin()) : ?>
		{
		    xtype: 'button', // default for Toolbars
            text: 'Admin',
			menu: new Ext.menu.Menu({
				items: [
					mnuUsers,
					mnuProjects,
				]
			})
        },
		<?php endif ?>
		<?php if (isUser() || isAdmin()) : ?>
		'-',
		{
            xtype: 'button', // default for Toolbars
            text: 'Reports',
			icon: 'icons/report.png',
			menu: new Ext.menu.Menu({
				items: [
					mnuShowCharts,
				]
			})
        },		
		<?php endif ?>
		// add a vertical separator bar between toolbar items
        '-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
		{
            xtype: 'button', // default for Toolbars
            text: 'Settings',
			icon: 'icons/settings.png',
			menu: new Ext.menu.Menu({
				items: [
					<?php if (isUser()) : ?> mnuProfile, <?php endif ?>
					mnuTheme
				]
			})
        },		
		// begin using the right-justified button container
        '->', // same as { xtype: 'tbfill' }
		'-',
		{
            xtype: 'button', // default for Toolbars
            text: 'Current Project: ',
			handler: function(){ 
				showAvailableProjects(null);
			},
			icon: 'icons/projects.png'
        },
		{
            xtype: 'label', // default for Toolbars
			id: 'moneta.label.currPrj',
            text: '<?= $_chosenPrj ?>',
        },
		'-',
		// begin using the right-justified button container
        {
            xtype: 'button', // default for Toolbars
            text: 'About',
			icon: 'icons/about.png',
			handler: function(){ showAbout(); }
        },
		'-',
		{
            xtype: 'button', // default for Toolbars
			icon: 'icons/theuser.png',
            text: 'User: <?= $_user ?>',
			menu: new Ext.menu.Menu({
				items: [				
					mnuLogout
				]
			})
        },		
    ]
});

</script>