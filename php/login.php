<?php
	error_reporting(0);
	if(!isset($_SESSION)){session_start();}
	if(!isset($_SESSION['authuser'])) {
		// User not authorized rendering login window.
?>
		<?php 
			$BASEPATH = dirname(__FILE__);
			include_once $BASEPATH . '/header.php';
			include_once $BASEPATH . '/support/MonetaDB.php';
			// Used to initialize the DB at install phase
			MonetaDB::disconnect(MonetaDB::connect());
		?>

			<script>	
				var alreadyInitiated = false;
				var loginForm;
				var win;
				
				function onSubmit() {
					var form = Ext.getCmp('moneta.widgets.login').getForm();
					if (form.isValid()) {
						form.submit({
							waitMsg: 'Authenticating...',
							url: 'php/checklogin.php',							
							success: function(form, action) {
							   form.reset();
							   // Redirect
							   Ext.Ajax.request({
									waitMsg: 'Logging in...',
									url: 'index.php',
									success : function() {
										window.location = 'index.php'; //the location you want your browser to be  redirected.
									},									
								});
							},
							failure: function(form, action) {
								form.reset();
							}
						});
					}
				};
			
				var Login = (function(){
					if (alreadyInitiated) {
						loginForm.reset();
						win.show();
						return;
					  }

					Ext.QuickTips.init();
					// turn on validation errors beside the field globally
					Ext.form.Field.prototype.msgTarget = 'side';
					
					loginForm = Ext.create('Ext.form.Panel', {
						//title: 'Login',
						bodyPadding: 5,
						id: 'moneta.widgets.login',
						method: 'POST',
						labelWidth: 85, 
						bodyStyle:'padding:10px 10px 0',
						frame: true,
						border: 7,
						stateful:false,
						defaults: {width: 280},
						// The fields
						defaultType: 'textfield',
						items: [{
							fieldLabel: 'Login',
							name: 'usr',
							allowBlank: false,	
							selectOnFocus: true,
							listeners: {
								specialkey: function(field, e){
									if (e.getKey() == e.ENTER) {
										onSubmit();
									}
								},
							},				
						},{
							fieldLabel: 'Password',
							name: 'pwd',
							allowBlank: false,
							inputType: 'password',
							listeners: {
								specialkey: function(field, e){
									if (e.getKey() == e.ENTER) {
										onSubmit();
									}
								}
							},
						}],
						// Reset and Submit buttons
						buttons: [
						{
							text: 'Submit',
							formBind: true, //only enabled once the form is valid
							disabled: true,
							
							handler: function() {
								onSubmit();
							}
						}],
						renderTo: Ext.getBody()
					});
					
				
					win = Ext.create('Ext.window.Window', {
							applyTo : 'login-win',
							bodyStyle : 'padding:5px 5px 0; border: 0;',
							width : 340,
							height : 150,
							closable : false,
							collapsible : false,
							resizable : false,
							modal : true,
							title : 'Please login...',
							plain : true,
							layout : 'fit',
					});

					win.add(loginForm);		
					win.center();
					win.show();
					alreadyInitiated = true;
					});
					
				Ext.onReady(Login);
			</script>

		<?php
			include_once $BASEPATH . '/footer.php';
		?>

<?php
	} // user not authorized
?>