Ext.namespace("Ext.ux.Action");

/**
  * The JSON Submit is a Submit action that send JSON instead of send URL Encoded data... You MUST specify the jsonRoot
  * property...
  * @param form The form to submit
  * @param options The options of the HTTP Request
  */
Ext.define('Ext.form.action.JsonSubmit', {
 	extend : 'Ext.form.action.Submit',
 	alternateClassName : 'Ext.form.Action.JsonSubmit',
 	alias : 'formaction.JsonSubmit',

 	type : 'JsonSubmit',

 	run : function () {
 		var method = this.getMethod();
 		var isGet = method == 'GET';
 		if (this.clientValidation === false || this.form.isValid()) {
 			var encodedParams = Ext.encode(this.form.getValues());

 			Ext.Ajax.request(Ext.apply(this.createCallback(this.form), {
 					url : this.getUrl(isGet),
 					method : method,
 					waitMsg : "Please wait while saving",
 					waitTitle : "Please wait",
 					headers : {
 						'Content-Type' : 'application/json'
 					},
 					params : Ext.String.format('{{0}: {1}}', this.form.jsonRoot, Ext.encode(this.form.getValues())),
 					isUpload : this.form.fileUpload
 				}));
 		} else if (this.clientValidation !== false) { // client validation failed
 			this.failureType = Ext.form.Action.CLIENT_INVALID;
 			this.form.afterAction(this, false);
 		}
 	}
 });