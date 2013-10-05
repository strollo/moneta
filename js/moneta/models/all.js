
/*
 * Loads all the models.
 */
var currPath = 'js/moneta/models';
console.log('Loading from ... ' + currPath);
Ext.Loader.loadScript( currPath + '/EntryModel.js' );
Ext.Loader.loadScript( currPath + '/ProjectModel.js' );
Ext.Loader.loadScript( currPath + '/UserModel.js' );
Ext.Loader.loadScript( currPath + '/AccountModel.js' );
Ext.Loader.loadScript( currPath + '/TagModel.js' );