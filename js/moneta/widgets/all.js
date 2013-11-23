
/*
 * Loads all the widgets.
 */
var currPath = 'js/moneta/widgets';
console.log('Loading from ... ' + currPath);
Ext.Loader.loadScript( currPath + '/ToggableWindow.js' );
Ext.Loader.loadScript( currPath + '/HighChart.js' );
Ext.Loader.loadScript( currPath + '/HighStock.js' );
Ext.Loader.loadScript( currPath + '/EmbeddedWindow.js' );
Ext.Loader.loadScript( currPath + '/UploadWindow.js' );