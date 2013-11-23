
function restoreProject(successCallback) {
	var win = Ext.create('moneta.widgets.UploadWindow', { url: moneta.Globals.data.DATA_BACKUP_PROJECT, });
	win.toggle();
}