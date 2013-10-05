
/*
 * Loads all the actions.
 */
var currPath = 'js/moneta/smart';
console.log('Loading from ... ' + currPath);
Ext.Loader.loadScript( currPath + '/SmartStore.js' );
Ext.Loader.loadScript( currPath + '/SmartComboBox.js' );
Ext.Loader.loadScript( currPath + '/SmartGrid.js' );
Ext.Loader.loadScript( currPath + '/SmartForm.js' );
Ext.Loader.loadScript( currPath + '/SmartEditForm.js' );
Ext.Loader.loadScript( currPath + '/SmartAjaxReq.js' );