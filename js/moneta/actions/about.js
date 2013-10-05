function showAbout() {

	var win = Ext.create('Ext.window.Window', {
		title: 'About',
		layout: 'fit',
		width: 500,
		height: 600,
		items: [
			{
				xtype: 'tabpanel',
				activeTab: 0,
				bodyPadding: 10,
				tabPosition: 'bottom',
				renderTo : Ext.getBody(),
				items: [
					{
						xtype: 'panel',
						autoScroll: true,
						bodyPadding: 10,
						title: 'Moneta License',
						html: 	'<h1 style="color: gray;">Moneta License</h1><br/>' +
								'<img src="icons/coins.png" width="80px"><br/>'+	
								'This project is <b>copyright</b> of <a href="mailto:daniele.strollo@gmail.com">Daniele Strollo</a>' +
								'<br/><br/><b>License: GPL3</b><br/>' +
								'<p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. </p>' +
								'<p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. </p>' +
								'See the <b>GNU General Public License</b> for more details. <br/>' +
								'You should have received a copy of the GNU General Public License along with this program. <br/>' +
								'If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>. <br/>' +
								'<br/><br/><center><b>Donations are always welcome ;)</b><br/><br/>' +
								
								'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">' +
								'<input type="hidden" name="cmd" value="_s-xclick">' +
								'<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----">' +
								'<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online.">' +
								'<img alt="" border="0" src="https://www.paypalobjects.com/it_IT/i/scr/pixel.gif" width="1" height="1">' +
								'</form></center>' +
								
								'<br/><br/>',
					},
					{
						xtype: 'panel',
						title: 'Dependencies',
						bodyPadding: 10,
						autoScroll: true,
						html: 	'<h1 style="color: gray;">Related software Licenses</h1><br/>' +
								'<img src="deps/icons/sencha.png" width="140px"><br/>'+
								'<b>Open Source License</b><br/>' +
								'<b>License: GPL3</b>' +
								'<p>' +
								'Sencha is an avid supporter of open source software. Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3.'+
								'</p>' +
								'<p>' +
								'Although the GPLv3 has many terms, the most important is that you must provide the source code of your application to your users so they can be free to modify your application for their own needs.' +
								'</p>' +
								'<p>' +
								'<i>For further information please visit:</i> <a href="http://www.sencha.com/products/extjs/license">http://www.sencha.com/products/extjs/license</a>' +
								'</p>' +
								'<br/><br/>' +
								'<h2>Highcharts JS License</h2>' +
								'<img src="deps/icons/highcharts.png" width="80px"><br/>'+								
								'<b>Free - Non-commercial</b><br/>' +
								'<b>License: <a href="http://creativecommons.org/licenses/by-nc/3.0/">Creative Commons</a></b><br/>' +
								'<b>Attribution</b> - You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).<br/>' +
								'<b>Disclaimer</b> -Do you want to use Highcharts for a personal or non-profit project?<br/>' + 
								'Then you can use Highchcarts for free under the  Creative Commons Attribution-NonCommercial 3.0 License.<br/>' + 
								'Find out more about Non-commercial - <a href="http://shop.highsoft.com/faq">Highcharts JS Free licenses FAQ</a><br/><br/>' +	
								'<i>For further information please visit:</i> <a href="http://shop.highsoft.com/highcharts.html">http://shop.highsoft.com/highcharts.html</a>' +
								'<br/><br/>' +
								'<h2>Google Web Toolkit (GWT) License</h2>' +
								'<img src="deps/icons/gwt.png" width="80px"><br/>'+									
								'<b>Apache License, Version 2.0</b><br/>' +
								'<b>Terms of Service</b><br/>' +
								'Google is a member of the GWT Open Source Project and operates this GWT website as a contribution to GWT.<br/>' +
								'The Google Terms of Service apply to Google\'s operation of this website.<br/>' +
								'The GWT software and sample code developed by Google is licensed under the Apache License, v. 2.0.<br/>' +
								'Other software included in this distribution is provided under other licenses, as listed in the <br/>' +
								'Included Software and Licenses section at the bottom of this page. <br/>' +
								'Source code for software included in this distribution is available from the GWT project or as otherwise indicated at the bottom of this page.<br/>' +
								'Please note that the executable version of the GWT distributed by Google will communicate with Google\'s servers to check for available updates. If updates are available, you will receive the option to install them.<br/><br/>' +
								'<i>For further information please visit:</i> <a href="http://www.gwtproject.org/terms.html">http://www.gwtproject.org/terms.html</a>' +
								'<br/><br/>' +
								'<h2>Moneta Logo</h2>' +
								'<img src="icons/coins.png" width="80px"><br/>'+								
								'<b>Free - Non-commercial</b><br/>' +
								'<b>License: <a href="http://creativecommons.org/licenses/by-nc/3.0/">Creative Commons</a></b><br/>' +
								'<b>Designer: </b><a href="http://www.visualpharm.com/">VisualPharm (Ivan Boyko)</a><br/><br/>',
					}
				], // TabPanel items
			}
		], // win items
	});
	
		
	win.show();
}