
/*
 * Loads all the actions.
 */
var currPath = 'js/moneta/actions';
console.log('Loading from ... ' + currPath);
Ext.Loader.loadScript( currPath + '/about.js' );
Ext.Loader.loadScript( currPath + '/chooseProject.js' );
Ext.Loader.loadScript( currPath + '/showProjects.js' );
Ext.Loader.loadScript( currPath + '/showUsers.js' );
Ext.Loader.loadScript( currPath + '/showCharts.js' );
Ext.Loader.loadScript( currPath + '/showTags.js' );
Ext.Loader.loadScript( currPath + '/showStocks.js' );
Ext.Loader.loadScript( currPath + '/showReconciliations.js' );
Ext.Loader.loadScript( currPath + '/createForm.js' );
Ext.Loader.loadScript( currPath + '/createEditForm.js' );

// Accounts
Ext.Loader.loadScript( currPath + '/accounts/create.js' );
Ext.Loader.loadScript( currPath + '/accounts/show.js' );
Ext.Loader.loadScript( currPath + '/accounts/delete.js' );
Ext.Loader.loadScript( currPath + '/accounts/edit.js' );

// Entries - Activities
Ext.Loader.loadScript( currPath + '/entries/create.js' );
Ext.Loader.loadScript( currPath + '/entries/show.js' );

// OnLogin handler
Ext.Loader.loadScript( currPath + '/onLogin.js' );